import test from 'node:test';
import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { Keypair, PublicKey, TransactionMessage, TransactionInstruction, VersionedTransaction, Ed25519Program } from '@solana/web3.js';
import { createPartnerMintClient, PartnerMintError, PARTNER_MINT_PROGRAM_ID } from '../partner-mint.js';
import { createDevnetIntegration } from '../examples/partner-mint-devnet.js';

function fixture() {
  const payer = Keypair.generate(), id = 'a'.repeat(24), calls = [], events = [];
  const quote = {
    cluster: 'devnet', program: PARTNER_MINT_PROGRAM_ID, partnerId: 'devnet-testpartner', handle: 'ansem', wallet: payer.publicKey.toBase58(),
    partnerRevision: '1', settingsRevision: '1', treasury: Keypair.generate().publicKey.toBase58(), revenueWallet: Keypair.generate().publicKey.toBase58(),
    collection: Keypair.generate().publicKey.toBase58(), currency: 'SOL', expiresAtUnix: Math.floor(Date.now() / 1000) + 120,
    mintPriceLamports: '100000001', partnerShareLamports: '50000000', protocolShareLamports: '50000001', quoteDigest: 'digest', quoteSignature: 'signature',
  };
  const message = new TransactionMessage({ payerKey: payer.publicKey, recentBlockhash: Keypair.generate().publicKey.toBase58(), instructions: [
    Ed25519Program.createInstructionWithPublicKey({ publicKey: payer.publicKey.toBytes(), message: new Uint8Array([1]), signature: new Uint8Array(64) }),
    new TransactionInstruction({ programId: new PublicKey(PARTNER_MINT_PROGRAM_ID), data: new Uint8Array([1]), keys: [{ pubkey: payer.publicKey, isSigner: true, isWritable: true }] }),
  ] }).compileToV0Message();
  const tx = new VersionedTransaction(message);
  const quoted = { intentId: id, quoteId: id, quote, expiresAt: new Date(quote.expiresAtUnix * 1000).toISOString() };
  const prepared = { cluster: 'devnet', intentId: id, quote, status: 'PREPARED', transactionBase64: Buffer.from(tx.serialize()).toString('base64'), lastValidBlockHeight: 100,
    estimatedAccountCostsLamports: '1000', estimatedNetworkFeeLamports: '5000', estimatedTotalLamports: '100006001', walletPriorityFeeCapLamports: '1000000' };
  const wallet = { publicKey: payer.publicKey, async signTransaction(transaction) { events.push('sign'); transaction.sign([payer]); return transaction; } };
  const status = { cluster: 'devnet', intentId: id, status: 'PENDING', signature: 'test-signature', receipt: null };
  const state = { quoted, prepared, status, failSubmit: false, beforePrepare: null };
  const invoke = async (name, payload) => {
    calls.push({ name, payload });
    assert.equal(payload.cluster, 'devnet');
    if (payload.action === 'availability') return { data: { ...quote, available: true, status: 'AVAILABLE', advisoryOnly: true } };
    if (payload.action === 'quote') return { data: state.quoted };
    if (payload.action === 'prepare') { state.beforePrepare?.(); return { data: state.prepared }; }
    if (payload.action === 'status') return { data: state.status };
    if (payload.action === 'submit') { events.push('submit'); if (state.failSubmit) throw new Error('Relay timed out'); return { data: state.status }; }
    throw new Error('Unexpected action');
  };
  return { payer, id, wallet, state, events, calls, invoke, client: createPartnerMintClient({ partnerId: quote.partnerId, invoke }) };
}
const code = expected => error => error.code === expected;

test('requires an explicit authenticated transport, canonical partner and Devnet', () => {
  assert.throws(() => createPartnerMintClient({ partnerId: 'partner', cluster: 'mainnet-beta', invoke() {} }), code('DEVNET_ONLY'));
  assert.throws(() => createPartnerMintClient({ partnerId: 'BAD', invoke() {} }), code('INVALID_PARTNER_ID'));
  assert.throws(() => createPartnerMintClient({ partnerId: 'partner' }), code('TRANSPORT_REQUIRED'));
});

test('normalizes handles and preserves exact odd-lamport shares without signing', async () => {
  const f = fixture();
  await f.client.checkAvailability(' @Ansem ');
  const quoted = await f.client.getMintQuote('@Ansem', f.wallet);
  const prepared = await f.client.prepareMint(quoted);
  assert.equal(prepared.quote.partnerShareLamports, '50000000');
  assert.equal(prepared.quote.protocolShareLamports, '50000001');
  assert.equal(f.calls[0].payload.handle, 'ansem');
  assert.deepEqual(f.events, []);
  assert.deepEqual(f.calls.map(call => call.name), ['partnerMintRead', 'partnerMintRead', 'partnerMintTransaction']);
});

test('rejects invalid handle before requesting a quote', async () => {
  const f = fixture();
  await assert.rejects(f.client.getMintQuote('bad_handle', f.wallet), code('INVALID_HANDLE'));
  assert.equal(f.calls.length, 0);
});

test('rejects wrong cluster, partner, wallet and split', async () => {
  for (const [patch, expected] of [[{ cluster: 'mainnet-beta' }, 'WRONG_CLUSTER'], [{ program: Keypair.generate().publicKey.toBase58() }, 'WRONG_CLUSTER'], [{ partnerId: 'other' }, 'QUOTE_MISMATCH'], [{ wallet: Keypair.generate().publicKey.toBase58() }, 'QUOTE_MISMATCH'], [{ protocolShareLamports: '50000000' }, 'INVALID_SPLIT']]) {
    const f = fixture(); Object.assign(f.state.quoted.quote, patch);
    await assert.rejects(f.client.getMintQuote('ansem', f.wallet), code(expected));
  }
});

test('rejects expired quotes and incorrect cost totals', async () => {
  const f = fixture();
  f.state.quoted.quote.expiresAtUnix = Math.floor(Date.now() / 1000) - 1;
  await assert.rejects(f.client.prepareMint(f.state.quoted), code('QUOTE_EXPIRED'));
  assert.equal(f.calls.length, 0);
  f.state.quoted.quote.expiresAtUnix += 120;
  f.state.prepared.estimatedTotalLamports = '1';
  await assert.rejects(f.client.prepareMint(f.state.quoted), code('INVALID_PREPARATION'));
});

test('rejects an unrelated transaction payer before signing', async () => {
  const f = fixture();
  const transaction = VersionedTransaction.deserialize(Buffer.from(f.state.prepared.transactionBase64, 'base64'));
  transaction.message.staticAccountKeys[0] = Keypair.generate().publicKey;
  f.state.prepared.transactionBase64 = Buffer.from(transaction.serialize()).toString('base64');
  await assert.rejects(f.client.prepareMint(f.state.quoted), code('TRANSACTION_MISMATCH'));
  assert.deepEqual(f.events, []);
});

test('changed costs require another explicit review, never an automatic signature', async () => {
  const f = fixture(), prepared = { ...f.state.prepared };
  f.state.prepared = { ...prepared, estimatedNetworkFeeLamports: '6000', estimatedTotalLamports: '100007001' };
  await assert.rejects(f.client.mint({ prepared, wallet: f.wallet, onSigned() {} }), error => error.code === 'REVIEW_CHANGED' && error.prepared === f.state.prepared);
  assert.deepEqual(f.events, []);
});

test('persists signed bytes before submit and refuses another signing attempt', async () => {
  const f = fixture(); let saved;
  const result = await f.client.mint({ prepared: f.state.prepared, wallet: f.wallet, onSigned(record) { f.events.push('persist'); saved = record; } });
  assert.deepEqual(f.events, ['sign', 'persist', 'submit']);
  assert.equal(result.status, 'PENDING');
  assert.equal(f.calls.at(-1).payload.signedTransaction, saved.signedTransaction);
  assert.equal(saved.cluster, 'devnet');
  await assert.rejects(f.client.mint({ prepared: f.state.prepared, wallet: f.wallet, onSigned() {} }), code('ALREADY_SIGNED'));
});

test('persistence failure prevents broadcasting and exposes the signed record', async () => {
  const f = fixture();
  await assert.rejects(f.client.mint({ prepared: f.state.prepared, wallet: f.wallet, onSigned() { throw new Error('Storage full'); } }), error => Boolean(error.signedRecord?.signedTransaction));
  assert.deepEqual(f.events, ['sign']);
});

test('relay timeout preserves the same bytes, without another signature', async () => {
  const f = fixture(); let saved;
  f.state.failSubmit = true;
  await assert.rejects(f.client.mint({ prepared: f.state.prepared, wallet: f.wallet, onSigned(record) { saved = record; } }), error => error instanceof PartnerMintError && error.code === 'TRANSPORT_ERROR' && error.signedRecord === saved);
  f.state.failSubmit = false;
  await f.client.submitMint(saved);
  assert.equal(f.events.filter(event => event === 'sign').length, 1);
  assert.deepEqual(f.calls.filter(call => call.payload.action === 'submit').map(call => call.payload.signedTransaction), [saved.signedTransaction, saved.signedTransaction]);
});

test('wallet change during signing keeps a recovery record and prevents broadcast', async () => {
  const f = fixture(); let saved;
  f.wallet.signTransaction = async transaction => { transaction.sign([f.payer]); f.wallet.publicKey = Keypair.generate().publicKey; return transaction; };
  await assert.rejects(f.client.mint({ prepared: f.state.prepared, wallet: f.wallet, onSigned(record) { saved = record; } }), code('WALLET_CHANGED'));
  assert.ok(saved.signedTransaction);
  assert.ok(!f.calls.some(call => call.payload.action === 'submit'));
});

test('preserves backend permission errors and request IDs', async () => {
  const client = createPartnerMintClient({ partnerId: 'partner', invoke: async () => {
    const error = new Error('Forbidden'); error.response = { status: 403, data: { error: { code: 'ADMIN_PILOT_ONLY', message: 'Administrator pilot only' }, requestId: 'request-1' } }; throw error;
  } });
  await assert.rejects(client.checkAvailability('ansem'), error => error.code === 'ADMIN_PILOT_ONLY' && error.status === 403 && error.requestId === 'request-1');
});

test('the executable example uses SDK review, signing and safe recovery', async () => {
  const f = fixture(), example = createDevnetIntegration({ partnerId: 'devnet-testpartner', invoke: f.invoke });
  await example.checkAvailability('ansem');
  const { prepared } = await example.review('ansem', f.wallet); let saved;
  await example.confirm({ prepared, wallet: f.wallet, persistSigned(record) { saved = record; } });
  f.state.status = { ...f.state.status, status: 'FINALIZED' };
  const before = f.calls.filter(call => call.payload.action === 'submit').length;
  assert.equal((await example.relaySaved(saved)).status, 'FINALIZED');
  assert.equal(f.calls.filter(call => call.payload.action === 'submit').length, before);
});