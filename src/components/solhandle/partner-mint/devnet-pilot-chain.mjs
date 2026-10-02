import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction, TransactionMessage, VersionedTransaction, Ed25519Program, SYSVAR_INSTRUCTIONS_PUBKEY, SYSVAR_CLOCK_PUBKEY } from '@solana/web3.js';
export const rpc = new Connection('https://api.devnet.solana.com', 'confirmed');
export const PROGRAM = new PublicKey('ATJutPfzXiYpf7NXaGPEBek69jHaU8Cy85ekUH8drMGT');
const CORE = new PublicKey('CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d');
export const BUYER = new PublicKey('HmxxAgrQdBqSyFNvjTnzJxVnuHPqzV8ufGGmfTR8kHyh');
export const HANDLE = 'partnerpilot1', PARTNER_ID = 'devnet-testpartner';
const WALLET = new PublicKey('BKWUshcZsL3VKSVo2Ficqr2KJYRzjBDLMuoeyLjH2cqk');
const SIGNER = '9N351uhUi2mzsa4d7LL9B5ii1tbM8q12CVLqPXuFRk2e';
const URI = 'https://base44.app/api/apps/6a86b7e4bcec5dfac8ee9a44/files/mp/public/6a86b7e4bcec5dfac8ee9a44/5b9e2d751_partnerpilot1-devnet.json';
const sha = bytes => createHash('sha256').update(bytes).digest();
const pda = (...seeds) => PublicKey.findProgramAddressSync(seeds.map(s => typeof s === 'string' ? Buffer.from(s) : s), PROGRAM)[0];
const key = (pubkey, isWritable = false, isSigner = false) => ({ pubkey, isWritable, isSigner });
const u64 = value => { const b = Buffer.alloc(8); b.writeBigUInt64LE(BigInt(value)); return b; };
const str = value => { const b = Buffer.from(value), n = Buffer.alloc(4); n.writeUInt32LE(b.length); return Buffer.concat([n, b]); };
const at = (data, offset) => new PublicKey(data.subarray(offset, offset + 32));
const CONFIG = pda('config'), SETTINGS = pda('partner_mint'), PARTNER = pda('partner', sha(PARTNER_ID));
const ASSET = pda('asset', HANDLE), RECORD = pda('handle', HANDLE), RECEIPT = pda('partner_receipt', ASSET.toBuffer());
function bytes(account, name, size) {
  assert(account && account.owner.equals(PROGRAM) && !account.executable, name + ': missing or incorrect owner');
  assert(account.data.length >= size && account.data.subarray(0, 8).equals(sha('account:' + name).subarray(0, 8)), name + ': invalid layout');
  return account.data;
}
export async function preflight() {
  assert.equal(await rpc.getGenesisHash(), 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG', 'Not devnet');
  assert((await rpc.getAccountInfo(PROGRAM))?.executable, 'Devnet program missing');
}
async function state() {
  const accounts = await rpc.getMultipleAccountsInfo([CONFIG, SETTINGS, PARTNER, RECORD, ASSET, RECEIPT, pda('restriction', HANDLE), pda('price', HANDLE), pda('premium', HANDLE), pda('rush'), SYSVAR_CLOCK_PUBKEY]);
  const c = bytes(accounts[0], 'Config', 187), s = bytes(accounts[1], 'PartnerMintSettings', 82), p = bytes(accounts[2], 'MintPartner', 88);
  assert(c[186] === 2 && c[184] === 0, 'Protocol paused or unsupported');
  assert(s[40] === 1 && at(s, 8).equals(CONFIG) && at(s, 41).toBase58() === SIGNER && s.readBigUInt64LE(73) === 2n, 'Devnet settings changed or disabled');
  const len = p.readUInt32LE(40), end = 44 + len;
  assert(len === PARTNER_ID.length && p.length >= end + 43 && p.subarray(44, end).toString() === PARTNER_ID && at(p, 8).equals(CONFIG), 'Invalid partner');
  assert(at(p, end).equals(WALLET) && p[end + 32] === 0 && p.readBigUInt64LE(end + 33) === 1n && p[end + 41] === 0, 'Partner state changed');
  assert(!BUYER.equals(WALLET) && !BUYER.equals(at(c, 72)) && !WALLET.equals(at(c, 72)), 'Buyer/partner/treasury must be distinct');
  assert(!accounts[3] && !accounts[4] && !accounts[5], 'Pilot handle already exists. Do not mint it again.');
  const optional = (index, name, size) => accounts[index]?.owner.equals(PROGRAM) && accounts[index].data.length ? bytes(accounts[index], name, size) : null;
  const restriction = optional(6, 'NameRestriction', 10); assert(!restriction || restriction[9] === 0, 'Handle restricted');
  assert(accounts[10]?.owner.equals(new PublicKey('Sysvar1111111111111111111111111111111111111')) && accounts[10].data.length >= 40, 'Missing chain clock');
  const now = Number(accounts[10].data.readBigInt64LE(32)); assert(Number.isSafeInteger(now) && now > 0, 'Invalid chain time');
  const override = optional(7, 'PriceOverride', 18), premium = optional(8, 'PremiumHandle', 10), rush = optional(9, 'RushConfig', 50);
  let price = override?.[16] === 1 ? override.readBigUInt64LE(8) : c.readBigUInt64LE(136 + 8 * Math.min(HANDLE.length - 1, 4));
  let surcharge = premium?.[8] === 1 ? 100000000n : 0n;
  if (rush?.[8] === 1 && BigInt(now) >= rush.readBigInt64LE(9) && BigInt(now) < rush.readBigInt64LE(17)) {
    if (HANDLE.length >= 3) price = rush.readBigUInt64LE(25);
    else { const product = price * rush.readBigUInt64LE(33); assert(product <= 18446744073709551615n, 'Price overflow'); price = product / 10000n; }
    if (premium?.[8] === 1) surcharge = rush.readBigUInt64LE(41);
  }
  price += surcharge; assert(price > 0n && price <= BigInt(Number.MAX_SAFE_INTEGER), 'Invalid mint price');
  return { now, price: price.toString(), collection: at(c, 40).toBase58(), treasury: at(c, 72).toBase58() };
}
const digest = q => sha(Buffer.concat([Buffer.from('solhandle:partner-sol:v1\0'), PROGRAM.toBuffer(), SETTINGS.toBuffer(), u64(2), BUYER.toBuffer(), PARTNER.toBuffer(), WALLET.toBuffer(), new PublicKey(q.treasury).toBuffer(), new PublicKey(q.collection).toBuffer(), u64(1), str(HANDLE), sha(URI), u64(q.price), u64(q.expiry)]));
export async function prepare() {
  const current = await state();
  const signer = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(readFileSync(homedir() + '/.config/solana/partner-mint-devnet-quote-signer.json', 'utf8'))));
  assert.equal(signer.publicKey.toBase58(), SIGNER, 'Local dedicated quote signer mismatch');
  const q = { ...current, expiry: current.now + 50 };
  const latest = await rpc.getLatestBlockhash();
  const transaction = new Transaction({ feePayer: BUYER, recentBlockhash: latest.blockhash });
  transaction.add(Ed25519Program.createInstructionWithPrivateKey({ privateKey: signer.secretKey, message: digest(q) }));
  transaction.add(new TransactionInstruction({ programId: PROGRAM, keys: [key(BUYER, true, true), key(CONFIG, true), key(SETTINGS), key(PARTNER), key(RECORD, true), key(ASSET, true), key(pda('restriction', HANDLE)), key(pda('price', HANDLE)), key(pda('rush')), key(pda('premium', HANDLE)), key(new PublicKey(q.collection), true), key(new PublicKey(q.treasury), true), key(WALLET, true), key(RECEIPT, true), key(SYSVAR_INSTRUCTIONS_PUBKEY), key(SystemProgram.programId), key(CORE)], data: Buffer.concat([sha('global:mint_handle_partner_sol').subarray(0, 8), str(HANDLE), str(URI), str(PARTNER_ID), u64(1), u64(2), u64(q.price), u64(q.expiry)]) }));
  const versioned = new VersionedTransaction(new TransactionMessage({ payerKey: BUYER, recentBlockhash: latest.blockhash, instructions: transaction.instructions }).compileToV0Message());
  const simulation = await rpc.simulateTransaction(versioned, { sigVerify: false, commitment: 'confirmed' });
  assert(!simulation.value.err, 'Devnet simulation failed: ' + JSON.stringify(simulation.value.err) + '\n' + (simulation.value.logs || []).join('\n'));
  const fresh = await state(); assert(fresh.price === q.price && fresh.treasury === q.treasury && fresh.collection === q.collection && fresh.now < q.expiry, 'Quote changed or expired; prepare again');
  const fee = (await rpc.getFeeForMessage(versioned.message)).value; assert(fee !== null, 'Fee unavailable');
  const rent = await Promise.all([106, 249, 300].map(size => rpc.getMinimumBalanceForRentExemption(size)));
  const minimumEstimate = BigInt(q.price) + BigInt(fee) + BigInt(rent[0] + rent[1] + rent[2]);
  assert(BigInt(await rpc.getBalance(BUYER)) >= minimumEstimate, 'Buyer needs more DEVNET SOL for price, network fee and account rent');
  return { q, ...latest, message: Buffer.from(versioned.message.serialize()).toString('base64'), transaction: Buffer.from(versioned.serialize()).toString('base64'), preview: { handle: '@' + HANDLE, buyer: BUYER.toBase58(), mintPriceLamports: q.price, partnerShareLamports: (BigInt(q.price) / 2n).toString(), treasuryShareLamports: (BigInt(q.price) - BigInt(q.price) / 2n).toString(), revenueWallet: WALLET.toBase58(), treasury: q.treasury, accountAndNetworkCostsExcluded: true, primaryEarnCommissionEligible: false, quoteValidForSeconds: 50 } };
}
export async function validateFresh(q) {
  const fresh = await state(); assert(fresh.now <= q.expiry && fresh.price === q.price && fresh.treasury === q.treasury && fresh.collection === q.collection, 'Quote expired or changed. Prepare and sign again.');
}
export function signatureOf(transaction) {
  const b = Buffer.from(transaction.signature ?? transaction.signatures[0]); assert(b.length === 64, 'Missing buyer signature');
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let number = BigInt('0x' + b.toString('hex')), result = '';
  while (number > 0n) { result = alphabet[Number(number % 58n)] + result; number /= 58n; }
  for (const value of b) { if (value !== 0) break; result = '1' + result; }
  return result;
}
export async function verify(saved) {
  const status = (await rpc.getSignatureStatuses([saved.signature], { searchTransactionHistory: true })).value[0];
  if (status?.err) return { status: 'FAILED', signature: saved.signature, error: status.err, networkFeesMayApply: true };
  if (!['confirmed', 'finalized'].includes(status?.confirmationStatus)) return { status: 'PENDING', signature: saved.signature, doNotCreateNewMint: true };
  const tx = await rpc.getTransaction(saved.signature, { commitment: status.confirmationStatus, maxSupportedTransactionVersion: 0 });
  if (!tx?.meta) return { status: 'PENDING', signature: saved.signature, confirmationHistoryUnavailable: true };
  assert(!tx.meta.err, 'Transaction failed');
  assert(Buffer.from(tx.transaction.message.serialize()).toString('base64') === saved.message, 'Confirmed message differs');
  const [r, a, h] = await rpc.getMultipleAccountsInfo([RECEIPT, ASSET, RECORD], { commitment: status.confirmationStatus, minContextSlot: tx.slot });
  const receipt = bytes(r, 'PartnerMintReceipt', 249); assert.equal(receipt.length, 249, 'Receipt size mismatch');
  for (const [offset, expected] of [[8, PARTNER], [40, ASSET], [72, BUYER], [104, WALLET], [136, new PublicKey(saved.q.treasury)]]) assert(at(receipt, offset).equals(expected), 'Receipt recipient mismatch');
  const price = BigInt(saved.q.price), partnerShare = price / 2n, treasuryShare = price - partnerShare;
  for (const [offset, expected] of [[168, price], [176, partnerShare], [184, treasuryShare], [192, 1n], [200, 2n]]) assert.equal(receipt.readBigUInt64LE(offset), expected, 'Receipt amount/revision mismatch');
  assert(receipt.subarray(216, 248).equals(digest(saved.q)), 'Receipt quote mismatch');
  assert(a?.owner.equals(CORE) && a.data.length >= 66 && a.data[0] === 1 && at(a.data, 1).equals(BUYER) && a.data[33] === 2 && at(a.data, 34).toBase58() === saved.q.collection, 'NFT owner or official collection mismatch');
  const record = bytes(h, 'HandleRecord', 106), len = record.readUInt32LE(8);
  assert(len === HANDLE.length && record.subarray(12, 12 + len).toString() === HANDLE && at(record, 12 + len).equals(ASSET) && at(record, 44 + len).equals(BUYER), 'Handle record mismatch');
  const keys = tx.transaction.message.staticAccountKeys ?? tx.transaction.message.accountKeys;
  const delta = address => { const i = keys.findIndex(k => k.toBase58() === address); assert(i >= 0, 'Missing transaction account'); assert(Number.isSafeInteger(tx.meta.postBalances[i]) && Number.isSafeInteger(tx.meta.preBalances[i]), 'Unsafe balance'); return BigInt(tx.meta.postBalances[i]) - BigInt(tx.meta.preBalances[i]); };
  assert.equal(delta(WALLET.toBase58()), partnerShare, 'Actual partner payment mismatch'); assert.equal(delta(saved.q.treasury), treasuryShare, 'Actual treasury payment mismatch');
  const accountCosts = delta(RECORD.toBase58()) + delta(ASSET.toBase58()) + delta(RECEIPT.toBase58());
  assert.equal(-delta(BUYER.toBase58()), price + accountCosts + BigInt(tx.meta.fee), 'Account/network costs were not kept outside the split');
  return { status: status.confirmationStatus === 'finalized' ? 'FINALIZED' : 'CONFIRMED', cluster: 'devnet', handle: '@' + HANDLE, partnerId: PARTNER_ID, signature: saved.signature, asset: ASSET.toBase58(), receipt: RECEIPT.toBase58(), owner: BUYER.toBase58(), collection: saved.q.collection, revenueWallet: WALLET.toBase58(), treasury: saved.q.treasury, mintPriceLamports: price.toString(), partnerShareLamports: partnerShare.toString(), treasuryShareLamports: treasuryShare.toString(), networkFeeLamports: String(tx.meta.fee), accountCostsLamports: accountCosts.toString(), ownerVerified: true, splitVerified: true, costsExcludedVerified: true, primaryEarnCommissionEligible: false, earnAccountingInvoked: false, mainnetIndexWritten: false };
}