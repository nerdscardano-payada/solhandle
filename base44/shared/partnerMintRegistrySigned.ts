import { VersionedTransaction } from 'npm:@solana/web3.js@1.98.4';
import { createPublicKey, verify } from 'node:crypto';
import { Buffer } from 'node:buffer';
import { unb64, b64, equal, sha, fault } from './partnerMintCodec.ts';
export default async function registrySigned(text, intent) {
  if (typeof text !== 'string' || text.length > 1644 || !/^[A-Za-z0-9+/]+={0,2}$/.test(text)) fault('INVALID_TRANSACTION', 400);
  let tx, original;
  try { const raw = unb64(text); if (raw.length > 1232) fault('INVALID_TRANSACTION', 400); tx = VersionedTransaction.deserialize(raw); original = VersionedTransaction.deserialize(unb64(intent.unsigned_transaction)); } catch { fault('INVALID_TRANSACTION', 400); }
  const message = tx.message.serialize();
  if (!equal(message, original.message.serialize()) || b64(await sha(message)) !== intent.message_hash || tx.signatures.length !== tx.message.header.numRequiredSignatures) fault('REGISTRY_TRANSACTION_MISMATCH', 400, 'Wallet changed the prepared registry transaction. No modified transaction is accepted.');
  for (let i = 0; i < tx.signatures.length; i++) {
    const key = createPublicKey({ key: Buffer.concat([Buffer.from('302a300506032b6570032100', 'hex'), Buffer.from(tx.message.staticAccountKeys[i].toBytes())]), format: 'der', type: 'spki' });
    if (!verify(null, Buffer.from(message), key, Buffer.from(tx.signatures[i]))) fault('REQUIRED_SIGNATURE_MISSING', 400, 'Every required wallet must supply a valid signature. Enrollment and wallet changes require both the protocol authority and the new revenue wallet.');
  }
  return tx;
}