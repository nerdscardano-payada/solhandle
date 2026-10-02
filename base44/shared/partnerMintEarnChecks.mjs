import assert from 'node:assert/strict';
import { createHash, webcrypto } from 'node:crypto';
import { primaryMintEarnPolicy } from './partnerMintEarnPolicy.mjs';
if (!globalThis.crypto) globalThis.crypto = webcrypto;
const asset = new Uint8Array(32).fill(2), owner = new Uint8Array(32).fill(3);
const input = { signature: 'local-fixture', handle: 'ansem', assetAddress: 'asset', buyerWallet: 'buyer' };
const bytes = Buffer.alloc(249);
createHash('sha256').update('account:PartnerMintReceipt').digest().copy(bytes, 0, 0, 8);
bytes.set(asset, 40); bytes.set(owner, 72);
bytes.writeBigUInt64LE(100000001n, 168); bytes.writeBigUInt64LE(50000000n, 176); bytes.writeBigUInt64LE(50000001n, 184);
const receipt = { owner: 'official-program', executable: false, data: [bytes.toString('base64'), 'base64'] };
const chain = { program: 'official-program', addresses: () => ({ asset: 'asset', receipt: 'receipt' }), keyBytes: key => key === 'asset' ? asset : owner, transaction: async () => ({ slot: 100, meta: { err: null } }), receipt: async () => ({ context: { slot: 100 }, value: receipt }) };
let passed = 0;
async function check(label, fn) { await fn(); console.log(`PASS ${++passed}: ${label}`); }
await check('Ordinary mint remains eligible', async () => assert.equal((await primaryMintEarnPolicy(input, { ...chain, receipt: async () => ({ context: { slot: 100 }, value: null }) })).eligible, true));
await check('Partner receipt excludes primary commission including odd lamport', async () => assert.equal((await primaryMintEarnPolicy(input, chain)).reason, 'partner_mint_primary_excluded'));
await check('Client partner flag cannot override chain receipt', async () => assert.equal((await primaryMintEarnPolicy({ ...input, partnerId: '', mintSource: 'direct' }, chain)).eligible, false));
await check('Duplicate checks remain excluded', async () => { for (let n = 0; n < 2; n++) assert.equal((await primaryMintEarnPolicy(input, chain)).eligible, false); });
for (const source of ['SECONDARY_ROYALTY', 'CREATOR_FEE']) await check(`${source} remains untouched`, async () => assert.equal((await primaryMintEarnPolicy({ source }, { transaction: () => { throw new Error('Must not read primary mint'); } })).eligible, true));
await check('RPC failure never permits commission', () => assert.rejects(() => primaryMintEarnPolicy(input, { ...chain, receipt: async () => { throw new Error('RPC unavailable'); } }), /RPC unavailable/));
await check('Lagging receipt read fails closed', () => assert.rejects(() => primaryMintEarnPolicy(input, { ...chain, receipt: async () => ({ context: { slot: 99 }, value: null }) }), /behind/));
await check('Failed transaction fails closed', () => assert.rejects(() => primaryMintEarnPolicy(input, { ...chain, transaction: async () => ({ slot: 100, meta: { err: 'failed' } }) }), /Successful/));
await check('Missing transaction fails closed', () => assert.rejects(() => primaryMintEarnPolicy(input, { ...chain, transaction: async () => null }), /Successful/));
await check('Wrong asset fails closed', () => assert.rejects(() => primaryMintEarnPolicy({ ...input, assetAddress: 'wrong' }, chain), /PDA/));
for (const [label, mutate, error] of [
  ['Foreign account owner', r => { r.owner = 'foreign'; }, /Untrusted/],
  ['Executable receipt', r => { r.executable = true; }, /Untrusted/],
  ['Wrong discriminator', r => { const b = Buffer.from(bytes); b[0] ^= 1; r.data[0] = b.toString('base64'); }, /layout/],
  ['Truncated receipt', r => { r.data[0] = bytes.subarray(0, 248).toString('base64'); }, /layout/],
  ['Wrong receipt asset', r => { const b = Buffer.from(bytes); b[40] ^= 1; r.data[0] = b.toString('base64'); }, /asset mismatch/],
  ['Wrong original owner', r => { const b = Buffer.from(bytes); b[72] ^= 1; r.data[0] = b.toString('base64'); }, /owner mismatch/],
  ['Wrong split', r => { const b = Buffer.from(bytes); b.writeBigUInt64LE(1n, 176); r.data[0] = b.toString('base64'); }, /split mismatch/],
]) await check(`${label} fails closed`, async () => { const value = structuredClone(receipt); mutate(value); await assert.rejects(() => primaryMintEarnPolicy(input, { ...chain, receipt: async () => ({ context: { slot: 100 }, value }) }), error); });
console.log(`EARN POLICY CHECKS PASSED: ${passed}. Mocked RPC only; no live API or network deployment verification.`);