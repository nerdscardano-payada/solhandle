import { VersionedTransaction, TransactionMessage } from 'npm:@solana/web3.js@1.98.4';
import nacl from 'npm:tweetnacl@1.0.3';
import walletAssertionInstruction from './walletAssertionInstruction.ts';
import { from64 } from './weekendTokenPrepare.ts';

const equal = (a, b) => a.length === b.length && a.every((value, i) => value === b[i]);
const sameInstruction = (a, b) => a && b && a.programId.equals(b.programId) && equal(a.data, b.data) && a.keys.length === b.keys.length && a.keys.every((key, i) => key.pubkey.equals(b.keys[i].pubkey) && key.isSigner === b.keys[i].isSigner && key.isWritable === b.keys[i].isWritable);
export function validateWeekendSignedTransaction(text, intent) {
  if (typeof text !== 'string' || text.length > 1644 || !/^[A-Za-z0-9+/]+={0,2}$/.test(text)) throw new Error('Invalid signed transaction.');
  const bytes = from64(text);
  if (bytes.length > 1232) throw new Error('Signed transaction exceeds the Solana size limit.');
  const signed = VersionedTransaction.deserialize(bytes), expected = VersionedTransaction.deserialize(from64(intent.unsigned));
  const actual = signed.message, original = expected.message;
  const mismatch = () => { throw new Error('Wallet changed the approved payment. No transaction was sent.'); };
  if (actual.addressTableLookups?.length || original.addressTableLookups?.length || actual.recentBlockhash !== original.recentBlockhash || actual.header.numRequiredSignatures !== 1 || signed.signatures.length !== 1) mismatch();
  const a = TransactionMessage.decompile(actual), e = TransactionMessage.decompile(original);
  if (!a.payerKey.equals(e.payerKey) || a.payerKey.toBase58() !== intent.wallet) mismatch();
  const keys = actual.staticAccountKeys ?? actual.accountKeys, oldKeys = original.staticAccountKeys ?? original.accountKeys;
  if (new Set(keys.map(key => key.toBase58())).size !== keys.length) mismatch();
  for (const [i, key] of oldKeys.entries()) {
    const j = keys.findIndex(value => value.equals(key));
    if (j < 0 || actual.isAccountSigner(j) !== original.isAccountSigner(i) || actual.isAccountWritable(j) !== original.isAccountWritable(i)) mismatch();
  }
  for (const [i, key] of keys.entries()) if (!oldKeys.some(value => value.equals(key)) && (actual.isAccountSigner(i) || actual.isAccountWritable(i))) mismatch();
  const start = a.instructions.findIndex(ix => sameInstruction(ix, e.instructions[0]));
  if (start < 0 || !e.instructions.every((ix, i) => sameInstruction(a.instructions[start + i], ix))) mismatch();
  const budgets = new Set(); let units = 1400000n, price = 0n;
  for (const [i, ix] of a.instructions.entries()) {
    if (i >= start && i < start + e.instructions.length) continue;
    if (ix.programId.toBase58() === 'ComputeBudget111111111111111111111111111111') {
      const data = ix.data, view = new DataView(data.buffer, data.byteOffset, data.byteLength);
      if (i >= start || ix.keys.length || budgets.has(data[0])) mismatch();
      budgets.add(data[0]);
      if (data[0] === 2 && data.length === 5) { units = BigInt(view.getUint32(1, true)); if (!units || units > 1400000n) mismatch(); }
      else if (data[0] === 3 && data.length === 9) price = view.getBigUint64(1, true);
      else mismatch();
    } else if (!walletAssertionInstruction(ix)) mismatch();
  }
  if ((price * units + 999999n) / 1000000n > 1000000n) throw new Error('Wallet priority fee exceeds the 0.001 SOL safety limit.');
  const used = new Set([a.payerKey.toBase58()]);
  for (const ix of a.instructions) { used.add(ix.programId.toBase58()); for (const key of ix.keys) used.add(key.pubkey.toBase58()); }
  if (keys.some(key => !used.has(key.toBase58()))) mismatch();
  if (!nacl.sign.detached.verify(actual.serialize(), signed.signatures[0], a.payerKey.toBytes())) throw new Error('Invalid wallet signature.');
  return signed;
}