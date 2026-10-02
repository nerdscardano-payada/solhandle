import { VersionedTransaction, TransactionMessage } from 'npm:@solana/web3.js@1.98.4';
import bs58 from 'npm:bs58@5.0.0';
import { rpc } from './solanaRpc.ts';
import { PROGRAM_ID, pda, enc, sha, b64, unb64, equal, fault, view, quoteDigest } from './partnerMintCodec.ts';
import partnerMintStatus from './partnerMintStatus.ts';
import partnerMintSigned from './partnerMintSigned.ts';
import { registryId } from './partnerMintRegistryState.ts';
export default async function recoverPartnerMint(base44, user, body, url) {
  const id = registryId(body.partnerId), signature = body.signature;
  if (typeof signature !== 'string' || !/^[1-9A-HJ-NP-Za-km-z]{64,88}$/.test(signature)) fault('INVALID_SIGNATURE', 400);
  const tx = await rpc(url, 'getTransaction', [signature, { encoding: 'base64', commitment: 'finalized', maxSupportedTransactionVersion: 0 }]);
  if (!tx?.meta || tx.meta.err || !tx.transaction?.[0]) fault('FINALIZED_TRANSACTION_REQUIRED', 409, 'A successful finalized Devnet transaction is required. A missing RPC result is not proof of mint failure.');
  const signed = VersionedTransaction.deserialize(unb64(tx.transaction[0]));
  if (bs58.encode(signed.signatures[0]) !== signature || signed.message.addressTableLookups?.length) fault('TRANSACTION_MISMATCH', 400);
  const message = TransactionMessage.decompile(signed.message), discriminator = (await sha(enc('global:mint_handle_partner_sol'))).slice(0, 8);
  const index = message.instructions.findIndex(ix => ix.programId.toBase58() === PROGRAM_ID && equal(ix.data.slice(0, 8), discriminator));
  const ix = message.instructions[index], verification = message.instructions[index - 1];
  if (!ix || ix.keys.length !== 17 || !verification || verification.programId.toBase58() !== 'Ed25519SigVerify111111111111111111111111111') fault('NOT_PARTNER_MINT', 400);
  const bytes = ix.data; let offset = 8;
  const text = max => { if (offset + 4 > bytes.length) fault('INVALID_TRANSACTION', 400); const length = view(bytes).getUint32(offset, true); offset += 4; if (length < 1 || length > max || offset + length > bytes.length) fault('INVALID_TRANSACTION', 400); const result = new TextDecoder('utf-8', { fatal: true }).decode(bytes.slice(offset, offset + length)); offset += length; return result; };
  const handle = text(20), uri = text(200), partnerId = text(32);
  if (partnerId !== id || !/^[a-z0-9]{1,20}$/.test(handle) || bytes.length !== offset + 32) fault('TRANSACTION_MISMATCH', 400);
  const amount = () => { const value = view(bytes).getBigUint64(offset, true); offset += 8; return value; };
  const partnerRevision = amount().toString(), settingsRevision = amount().toString(), price = amount(), expiry = amount();
  if (expiry > BigInt(Number.MAX_SAFE_INTEGER)) fault('INVALID_TRANSACTION', 400);
  const address = position => ix.keys[position].pubkey.toBase58(), wallet = message.payerKey.toBase58();
  if (address(0) !== wallet || address(3) !== pda('partner', await sha(enc(id))).toBase58()) fault('TRANSACTION_MISMATCH', 400);
  const quote = { cluster: 'devnet', program: PROGRAM_ID, partnerId, partnerPda: address(3), handle, uri, wallet, revenueWallet: address(12), treasury: address(11), collection: address(10), partnerRevision, settingsRevision, mintPriceLamports: price.toString(), partnerShareLamports: (price / 2n).toString(), protocolShareLamports: (price - price / 2n).toString(), expiresAtUnix: Number(expiry) };
  quote.quoteDigest = b64(await quoteDigest(quote));
  const original = new VersionedTransaction(new TransactionMessage({ payerKey: message.payerKey, recentBlockhash: signed.message.recentBlockhash, instructions: [verification, ix] }).compileToV0Message());
  const recovered = { wallet, unsigned_transaction: b64(original.serialize()), message_hash: b64(await sha(original.message.serialize())) };
  await partnerMintSigned(tx.transaction[0], recovered);
  const existing = await base44.entities.PartnerMintIntent.filter({ cluster: 'devnet', transaction_signature: signature }, { limit: 1 });
  let intent = existing.items[0];
  if (intent && intent.partner_id !== id) fault('TRANSACTION_MISMATCH', 400);
  if (!intent) {
    const input = { cluster: 'devnet', admin_user_id: user.id, partner_id: id, handle, wallet, quote, expires_at: new Date(Number(expiry) * 1000).toISOString(), status: 'SUBMITTED', unsigned_transaction: b64(original.serialize()), message_hash: b64(await sha(original.message.serialize())), transaction_signature: signature, receipt_indexed: false };
    const saved = await base44.entities.PartnerMintIntent.upsert([input], { key: ['cluster', 'transaction_signature'] }); intent = saved.records[0];
  }
  return await partnerMintStatus(base44, intent, url);
}