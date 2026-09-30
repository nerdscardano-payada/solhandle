import { Transaction, TransactionMessage, VersionedTransaction } from 'npm:@solana/web3.js@1.98.4';
import nacl from 'npm:tweetnacl@1.0.3';
// Validate the original wire signature, then expose the resolved instructions to the existing strict validator.
export default function decodeTokenTransaction(raw, table) {
  if (raw.length > 1232) throw new Error('Transaction exceeds the Solana packet limit.');
  const wire = VersionedTransaction.deserialize(raw);
  if (wire.version === 'legacy') return Transaction.from(raw);
  if (wire.version !== 0 || !table || wire.message.addressTableLookups.length !== 1 || !wire.message.addressTableLookups[0].accountKey.equals(table.key)) throw new Error('Only the verified protocol lookup table is allowed.');
  if (wire.message.header.numRequiredSignatures !== 1 || wire.signatures.length !== 1) throw new Error('Exactly one wallet signer is required.');
  const resolved = TransactionMessage.decompile(wire.message, { addressLookupTableAccounts: [table] });
  const tx = new Transaction({ feePayer: resolved.payerKey, recentBlockhash: resolved.recentBlockhash }).add(...resolved.instructions);
  const compiled = tx.compileMessage(), keys = wire.message.getAccountKeys({ addressLookupTableAccounts: [table] });
  if (keys.length !== compiled.accountKeys.length) throw new Error('Unused or unexpected transaction accounts are not allowed.');
  for (let i = 0; i < keys.length; i++) {
    const index = compiled.accountKeys.findIndex(key => key.equals(keys.get(i)));
    if (index < 0 || compiled.isAccountSigner(index) !== wire.message.isAccountSigner(i) || compiled.isAccountWritable(index) !== wire.message.isAccountWritable(i)) throw new Error('Transaction account permissions changed.');
  }
  tx.signatures = [{ publicKey: resolved.payerKey, signature: wire.signatures[0] }];
  tx.verifySignatures = () => nacl.sign.detached.verify(wire.message.serialize(), wire.signatures[0], resolved.payerKey.toBytes());
  return tx;
}