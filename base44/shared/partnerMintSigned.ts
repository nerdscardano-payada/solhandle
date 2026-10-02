import { VersionedTransaction, TransactionMessage } from 'npm:@solana/web3.js@1.98.4';
import { createPublicKey, verify } from 'node:crypto';
import { Buffer } from 'node:buffer';
import { b64, unb64, sha, equal, fault } from './partnerMintCodec.ts';
import walletAssertionInstruction from './walletAssertionInstruction.ts';
const same = (a, b) => a && b && a.programId.equals(b.programId) && equal(a.data, b.data) && a.keys.length === b.keys.length && a.keys.every((k, i) => k.pubkey.equals(b.keys[i].pubkey) && k.isSigner === b.keys[i].isSigner && k.isWritable === b.keys[i].isWritable);
export default async function partnerMintSigned(text, intent) {
  if (typeof text !== 'string' || text.length > 1644 || !/^[A-Za-z0-9+/]+={0,2}$/.test(text)) fault('INVALID_TRANSACTION', 400);
  let tx, expected;
  try { const raw = unb64(text); if (raw.length > 1232) fault('INVALID_TRANSACTION', 400); tx = VersionedTransaction.deserialize(raw); expected = VersionedTransaction.deserialize(unb64(intent.unsigned_transaction)); } catch { fault('INVALID_TRANSACTION', 400); }
  const actual = tx.message, original = expected.message;
  if (actual.addressTableLookups?.length || original.addressTableLookups?.length || actual.recentBlockhash !== original.recentBlockhash || actual.header.numRequiredSignatures !== 1 || tx.signatures.length !== 1) fault('TRANSACTION_MISMATCH', 400);
  const a = TransactionMessage.decompile(actual), e = TransactionMessage.decompile(original);
  if (e.instructions.length !== 2 || !a.payerKey.equals(e.payerKey) || a.payerKey.toBase58() !== intent.wallet || b64(await sha(original.serialize())) !== intent.message_hash) fault('TRANSACTION_MISMATCH', 400);
  const keys = actual.staticAccountKeys ?? actual.accountKeys, oldKeys = original.staticAccountKeys ?? original.accountKeys;
  if (new Set(keys.map(k => k.toBase58())).size !== keys.length) fault('TRANSACTION_MISMATCH', 400);
  for (const [i, key] of oldKeys.entries()) { const j = keys.findIndex(k => k.equals(key)); if (j < 0 || actual.isAccountSigner(j) !== original.isAccountSigner(i) || actual.isAccountWritable(j) !== original.isAccountWritable(i)) fault('TRANSACTION_MISMATCH', 400); }
  for (const [i, key] of keys.entries()) if (!oldKeys.some(k => k.equals(key)) && (actual.isAccountSigner(i) || actual.isAccountWritable(i))) fault('TRANSACTION_MISMATCH', 400);
  const quoteIndex = a.instructions.findIndex(ix => same(ix, e.instructions[0]));
  if (quoteIndex < 0 || !same(a.instructions[quoteIndex + 1], e.instructions[1])) fault('TRANSACTION_MISMATCH', 400);
  const budgets = new Set(); let units = 1400000n, price = 0n;
  for (const [i, ix] of a.instructions.entries()) {
    if (i === quoteIndex || i === quoteIndex + 1) continue;
    const data = Buffer.from(ix.data);
    if (ix.programId.toBase58() === 'ComputeBudget111111111111111111111111111111') {
      if (i >= quoteIndex || ix.keys.length || budgets.has(data[0])) fault('UNSAFE_WALLET_ADDITION', 400);
      budgets.add(data[0]);
      if (data[0] === 2 && data.length === 5) { units = BigInt(data.readUInt32LE(1)); if (!units || units > 1400000n) fault('UNSAFE_WALLET_ADDITION', 400); }
      else if (data[0] === 3 && data.length === 9) price = data.readBigUInt64LE(1);
      else fault('UNSAFE_WALLET_ADDITION', 400);
    } else { let assertion; try { assertion = walletAssertionInstruction(ix); } catch { fault('UNSAFE_WALLET_ADDITION', 400); } if (!assertion) fault('UNSAFE_WALLET_ADDITION', 400); }
  }
  if ((price * units + 999999n) / 1000000n > 1000000n) fault('PRIORITY_FEE_TOO_HIGH', 400, 'Devnet priority fee cap is 0.001 SOL.');
  const used = new Set([a.payerKey.toBase58()]); for (const ix of a.instructions) { used.add(ix.programId.toBase58()); for (const k of ix.keys) used.add(k.pubkey.toBase58()); }
  if (keys.some(k => !used.has(k.toBase58()))) fault('TRANSACTION_MISMATCH', 400);
  const publicKey = createPublicKey({ key: Buffer.concat([Buffer.from('302a300506032b6570032100', 'hex'), Buffer.from(a.payerKey.toBytes())]), format: 'der', type: 'spki' });
  if (!verify(null, Buffer.from(actual.serialize()), publicKey, Buffer.from(tx.signatures[0]))) fault('INVALID_SIGNATURE', 400);
  return tx;
}