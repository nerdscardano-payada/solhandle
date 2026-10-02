import assert from 'node:assert/strict';
import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import { fixture } from '../local-tests/fixture.mjs';
import { payments } from '../local-tests/payments.mjs';
import { security } from '../local-tests/security.mjs';
import { connection, send, rejection } from '../local-tests/transport.mjs';
import { PROGRAM, CORE, TOKEN } from '../local-tests/codec.mjs';
import { settingsPda, partnerPda, configureIx, createIx, statusIx, walletIx, accountData, readPartner } from './registry-local-client.mjs';
import solLocalChecks from './sol-local-checks.mjs';

let passed = 0;
async function check(label, action) { await action(); console.log(`PASS ${++passed}: ${label}`); }
try {
  assert.equal(connection.rpcEndpoint, 'http://127.0.0.1:18899', 'Localhost-only guard');
  for (const address of [PROGRAM, CORE]) assert((await connection.getAccountInfo(address))?.executable, 'Missing local executable');
  const f = await fixture(), id = 'example-partner', signer = Keypair.generate();
  const beforeConfig = (await connection.getAccountInfo(f.config)).data;
  const beforeToken = (await connection.getAccountInfo(f.payment)).data;
  await check('Unconfigured registry refuses partner enrollment', async () => {
    await rejection(() => send(f.authority, [createIx(f, id)], [f.buyer]), /AccountNotInitialized|not initialized/);
    assert.equal(await connection.getAccountInfo(partnerPda(id)), null);
  });
  await check('Non-authority cannot initialize Partner Mint settings', () => rejection(() => send(f.buyer, [configureIx(f, signer.publicKey, false, f.buyer)]), /ConstraintHasOne|has one/));
  for (const badSigner of [PublicKey.default, f.quoteSigner.publicKey, f.authority.publicKey, f.treasury.publicKey]) {
    await check('Reject zero, token, authority or treasury quote signer', () => rejection(() => send(f.authority, [configureIx(f, badSigner)]), /InvalidQuoteSigner/));
  }
  await check('Create separate settings disabled by default', async () => {
    await send(f.authority, [configureIx(f, signer.publicKey)]);
    const data = await accountData(settingsPda(), 'PartnerMintSettings');
    assert.equal(data[40], 0);
    assert(data.subarray(41, 73).equals(signer.publicKey.toBuffer()));
    assert.equal(data.readBigUInt64LE(73), 1n);
  });
  await check('Authority cannot enroll a wallet without its signature', () => rejection(() => send(f.authority, [createIx(f, id, f.buyer.publicKey, false)]), /AccountNotSigner|signer/));
  await check('Non-authority cannot enroll a partner', () => rejection(() => send(f.buyer, [createIx(f, id, f.buyer.publicKey, true, f.buyer)]), /ConstraintHasOne|has one/));
  for (const badId of ['', 'UPPER', 'has_space', 'a'.repeat(33)]) {
    await check(`Invalid canonical partner ID (${badId.length} bytes) rolls back`, async () => {
      await rejection(() => send(f.authority, [createIx(f, badId)], [f.buyer]), /InvalidId/);
      assert.equal(await connection.getAccountInfo(partnerPda(badId)), null);
    });
  }
  await check('Program-owned signer is not a revenue wallet', async () => {
    const badWallet = Keypair.generate();
    await send(f.authority, [SystemProgram.createAccount({ fromPubkey: f.authority.publicKey, newAccountPubkey: badWallet.publicKey, lamports: await connection.getMinimumBalanceForRentExemption(0), space: 0, programId: TOKEN })], [badWallet]);
    await rejection(() => send(f.authority, [createIx(f, 'wrong-owner', badWallet.publicKey)], [badWallet]), /ConstraintOwner|owner/);
    assert.equal(await connection.getAccountInfo(partnerPda('wrong-owner')), null);
  });
  await check('Joint authority and wallet signatures approve unique partner', async () => {
    await send(f.authority, [createIx(f, id)], [f.buyer]);
    const row = await readPartner(id);
    assert(row.config.equals(f.config)); assert(row.wallet.equals(f.buyer.publicKey));
    assert.equal(row.status, 0); assert.equal(row.revision, 1n); assert.equal(row.allowSelfMint, 0);
  });
  await check('Duplicate partner ID cannot replace approved wallet', async () => {
    await rejection(() => send(f.authority, [createIx(f, id, f.treasury.publicKey)], [f.treasury]), /already in use|already initialized/);
    assert((await readPartner(id)).wallet.equals(f.buyer.publicKey));
  });
  await check('Wrong partner PDA is rejected', () => rejection(() => send(f.authority, [statusIx(f, 'other-partner', 1n, 1, f.authority, partnerPda(id))]), /ConstraintSeeds|seeds/));
  await check('Partner cannot approve itself or change status', () => rejection(() => send(f.buyer, [statusIx(f, id, 1n, 1, f.buyer)]), /ConstraintHasOne|has one/));
  await check('Suspend, disable and reapprove with revision increments', async () => {
    for (const [revision, status] of [[1n, 1], [2n, 2], [3n, 0]]) {
      await send(f.authority, [statusIx(f, id, revision, status)]);
      const row = await readPartner(id); assert.equal(row.status, status); assert.equal(row.revision, revision + 1n);
    }
  });
  await check('Stale status approval leaves partner unchanged', async () => {
    await rejection(() => send(f.authority, [statusIx(f, id, 1n, 1)]), /StaleRevision/);
    assert.equal((await readPartner(id)).revision, 4n);
  });
  await check('Wallet change requires new-wallet ownership signature', () => rejection(() => send(f.authority, [walletIx(f, id, 4n, f.treasury.publicKey, false)]), /AccountNotSigner|signer/));
  await check('Wallet change rejects stale approval', () => rejection(() => send(f.authority, [walletIx(f, id, 3n, f.treasury.publicKey)], [f.treasury]), /StaleRevision/));
  await check('Jointly signed wallet change increments revision', async () => {
    await send(f.authority, [walletIx(f, id, 4n, f.treasury.publicKey)], [f.treasury]);
    const row = await readPartner(id); assert(row.wallet.equals(f.treasury.publicKey)); assert.equal(row.revision, 5n);
  });
  await check('Unchanged wallet cannot be silently re-enrolled', () => rejection(() => send(f.authority, [walletIx(f, id, 5n, f.treasury.publicKey)], [f.treasury]), /WalletUnchanged/));
  await check('Registry changes preserve Config and token-payment bytes', async () => {
    assert((await connection.getAccountInfo(f.config)).data.equals(beforeConfig));
    assert((await connection.getAccountInfo(f.payment)).data.equals(beforeToken));
    assert.equal((await accountData(settingsPda(), 'PartnerMintSettings'))[40], 0);
  });
  await payments(f, check);
  await security(f, check);
  await solLocalChecks(f, check);
  console.log(`PARTNER SOL MINT, FOUNDATION AND LEGACY TESTS PASSED: ${passed}. LOCAL ONLY. No devnet/mainnet deployment.`);
} catch (error) {
  console.error(`STOP: incomplete after ${passed} passes.\n${error.stack || error}`);
  process.exitCode = 1;
}