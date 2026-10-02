import assert from 'node:assert/strict';
import { Keypair, SystemProgram } from '@solana/web3.js';
import { connection, send, rejection, chainTime } from '../local-tests/transport.mjs';
import { pda, key, instruction, str, u64, systemKey } from '../local-tests/codec.mjs';
import { owner } from '../local-tests/assertions.mjs';
import { solMint } from '../local-tests/mint.mjs';
import { configureIx, createIx, statusIx, walletIx, accountData } from './registry-local-client.mjs';
import { partnerMint, receiptPda } from './sol-local-client.mjs';
async function snapshot(f, handle) {
  const accounts = await connection.getMultipleAccountsInfo([f.config, f.collection, pda('handle', handle), pda('asset', handle), receiptPda(handle)]);
  return { accounts: accounts.map(a => a?.data.toString('hex') ?? null), treasury: await connection.getBalance(f.treasury.publicKey), partner: f.revenue.publicKey.equals(f.buyer.publicKey) ? null : await connection.getBalance(f.revenue.publicKey) };
}
async function fails(f, handle, options, pattern) {
  const before = await snapshot(f, handle);
  await rejection(() => partnerMint(f, handle, options), pattern);
  assert.deepEqual(await snapshot(f, handle), before, 'Failed mint changed payments, NFT or receipt');
}
const overrideIx = (f, handle, price) => instruction('set_price_override', [key(f.authority.publicKey, true, true), key(f.config), key(pda('price', handle), true), systemKey()], str(handle), u64(price), Buffer.from([1]));
export default async function solLocalChecks(base, check) {
  const f = { ...base, revenue: base.rewards, partnerSigner: Keypair.generate() };
  await send(f.authority, [createIx(f, 'atomic-partner', f.revenue.publicKey)], [f.revenue]);
  await check('Partner mint disabled: zero settled revenue', () => fails(f, 'partnerdisabled', {}, /Disabled/));
  await send(f.authority, [configureIx(f, f.partnerSigner.publicKey, true)]);
  for (const [handle, price] of [['partnersuccess', 10000000n], ['partnerodd', 100000001n]]) {
    if (handle === 'partnerodd') await send(f.authority, [overrideIx(f, handle, price)]);
    await check(`Atomic SOL settlement and direct NFT ownership: ${handle}`, async () => {
      const before = await snapshot(f, handle);
      const buyerBefore = await connection.getBalance(f.buyer.publicKey);
      const signature = await partnerMint(f, handle, { args: { price } });
      const after = await snapshot(f, handle);
      assert.equal(BigInt(after.partner - before.partner), price / 2n);
      assert.equal(BigInt(after.treasury - before.treasury), price - price / 2n);
      await owner(f, handle);
      const receipt = await accountData(receiptPda(handle), 'PartnerMintReceipt');
      assert.equal(receipt.readBigUInt64LE(168), price);
      assert.equal(receipt.readBigUInt64LE(176), price / 2n);
      assert.equal(receipt.readBigUInt64LE(184), price - price / 2n);
      assert(receipt.subarray(72, 104).equals(f.buyer.publicKey.toBuffer()));
      const record = await connection.getAccountInfo(pda('handle', handle));
      const asset = await connection.getAccountInfo(pda('asset', handle));
      const receiptInfo = await connection.getAccountInfo(receiptPda(handle));
      let tx;
      for (let n = 0; n < 20 && !tx; n++) { tx = await connection.getTransaction(signature, { commitment: 'confirmed', maxSupportedTransactionVersion: 0 }); if (!tx) await new Promise(r => setTimeout(r, 250)); }
      assert(tx?.meta);
      assert.equal(buyerBefore - await connection.getBalance(f.buyer.publicKey), Number(price) + record.lamports + asset.lamports + receiptInfo.lamports + tx.meta.fee, 'Rent/network costs are outside the revenue split');
    });
  }
  await check('Duplicate partner handle cannot settle twice', () => fails(f, 'partnersuccess', {}, /already in use|already initialized/));
  const cases = [
    ['partnosign', { omitSignature: true }, /InvalidQuote/],
    ['partbadsign', { signer: f.quoteSigner }, /InvalidQuote/],
    ['partmetadata', { signed: { uri: 'https://example.invalid/changed.json' } }, /InvalidQuote/],
    ['partprice', { signed: { price: 9999999n } }, /InvalidQuote/],
    ['partname', { signed: { handle: 'otherhandle' } }, /InvalidQuote/],
    ['partrevision', { args: { revision: 2n } }, /StaleQuote/],
    ['partsettings', { args: { settingsRevision: 1n } }, /StaleQuote/],
    ['partstaleprice', { args: { price: 9999999n } }, /StaleQuote/],
    ['partwallet', { wallet: f.authority.publicKey }, /InvalidRecipient/],
    ['parttreasury', { treasury: f.authority.publicKey }, /WrongTreasury/],
    ['partbadid', { args: { id: 'missing-partner' } }, /AccountNotInitialized/],
  ];
  for (const [handle, options, pattern] of cases) await check(`Reject tampered partner mint: ${handle}`, () => fails(f, handle, options, pattern));
  const now = await chainTime();
  await check('Expired partner quote', () => fails(f, 'partexpired', { args: { expiry: now - 5 } }, /ExpiredQuote/));
  await check('Overlong partner quote', () => fails(f, 'partfuture', { args: { expiry: now + 1000 } }, /ExpiredQuote/));
  await check('Self-mint rejected', () => fails({ ...f, buyer: f.revenue }, 'partself', {}, /SelfMint/));
  await check('Late failure rolls back BOTH SOL transfers, NFT and receipt', () => fails(f, 'partrollback', { after: [SystemProgram.transfer({ fromPubkey: f.buyer.publicKey, toPubkey: f.treasury.publicKey, lamports: Number.MAX_SAFE_INTEGER })] }, /insufficient lamports/));
  await send(f.authority, [overrideIx(f, 'partpoor', 20000000000n)]);
  await check('Insufficient SOL rolls back receipt rent and settlement', () => fails(f, 'partpoor', { args: { price: 20000000000n } }, /insufficient lamports/));
  await send(f.authority, [instruction('set_name_restriction', [key(f.authority.publicKey, true, true), key(f.config), key(pda('restriction', 'partprotected'), true), systemKey()], str('partprotected'), Buffer.from([0]), str('local'), Buffer.from([1]))]);
  await check('Partner cannot mint a protected name', () => fails(f, 'partprotected', {}, /HandleRestricted/));
  await check('Concurrent buyers: exactly one NFT and one settlement', async () => {
    const handle = 'partrace', before = await snapshot(f, handle);
    const alternate = { ...f, buyer: f.authority };
    const results = await Promise.allSettled([partnerMint(f, handle), partnerMint(alternate, handle)]);
    assert.equal(results.filter(r => r.status === 'fulfilled').length, 1);
    assert.equal(results.filter(r => r.status === 'rejected').length, 1);
    const after = await snapshot(f, handle);
    assert.equal(after.partner - before.partner, 5000000);
    assert.equal(after.treasury - before.treasury, 5000000);
    await owner(results[0].status === 'fulfilled' ? f : alternate, handle);
  });
  await send(f.authority, [statusIx(f, 'atomic-partner', 1n, 1)]);
  await check('Suspended partner cannot mint', () => fails(f, 'partsuspended', { args: { revision: 2n } }, /NotApproved/));
  await send(f.authority, [statusIx(f, 'atomic-partner', 2n, 0)]);
  await check('Reapproval invalidates old quotes', () => fails(f, 'partoldquote', {}, /StaleQuote/));
  await send(f.authority, [walletIx(f, 'atomic-partner', 3n, f.authority.publicKey)], [f.authority]);
  await check('Wallet change invalidates old recipient', () => fails(f, 'partoldwallet', { args: { revision: 4n } }, /InvalidRecipient/));
  await send(f.authority, [configureIx(f, f.partnerSigner.publicKey, false)]);
  await check('Partner switch disables the partner route', () => fails({ ...f, revenue: f.authority }, 'partstopped', { args: { revision: 4n, settingsRevision: 3n } }, /Disabled/));
  await check('Ordinary SOL mint still works after partner suspension', async () => {
    const before = await connection.getBalance(f.treasury.publicKey);
    await solMint(f, 'ordinaryafter');
    assert.equal(await connection.getBalance(f.treasury.publicKey) - before, 10000000);
    await owner(f, 'ordinaryafter');
  });
}