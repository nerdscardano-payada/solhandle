import { VersionedTransaction, TransactionMessage, PublicKey } from 'npm:@solana/web3.js@1.98.4';
import { rpc } from './solanaRpc.ts';
import { readPartnerState, assertFresh } from './partnerMintChain.ts';
import { b64, unb64, sha, fault, mintInstructions } from './partnerMintCodec.ts';
import partnerMintCosts from './partnerMintCosts.ts';
export default async function preparePartnerMint(base44, intent, url, signer) {
  if (!['QUOTED', 'PREPARED'].includes(intent.status)) fault('INTENT_NOT_PREPARABLE', 409);
  const q = intent.quote, state = await readPartnerState(url, { handle: q.handle, partnerId: q.partnerId, wallet: q.wallet }, signer);
  assertFresh(q, state);
  if (intent.status === 'PREPARED') {
    const height = await rpc(url, 'getBlockHeight', [{ commitment: 'confirmed' }]);
    if (height > intent.last_valid_block_height) fault('BLOCKHASH_EXPIRED', 410);
    return { intentId: intent.id, status: 'PREPARED', transactionBase64: intent.unsigned_transaction, lastValidBlockHeight: intent.last_valid_block_height, quote: q, ...await partnerMintCosts(url, intent) };
  }
  const latest = await rpc(url, 'getLatestBlockhash', [{ commitment: 'confirmed' }]);
  const transaction = new VersionedTransaction(new TransactionMessage({ payerKey: new PublicKey(q.wallet), recentBlockhash: latest.value.blockhash, instructions: await mintInstructions(q, signer) }).compileToV0Message());
  const raw = transaction.serialize();
  if (raw.length > 1232) fault('TRANSACTION_TOO_LARGE', 422);
  const transactionBase64 = b64(raw);
  const simulation = await rpc(url, 'simulateTransaction', [transactionBase64, { encoding: 'base64', sigVerify: false, commitment: 'confirmed' }]);
  if (!simulation?.value || simulation.value.err) fault('SIMULATION_FAILED', 422, 'Devnet simulation failed. Check funds, deployed program and partner configuration; no transaction was sent.');
  const messageHash = b64(await sha(transaction.message.serialize()));
  await base44.entities.PartnerMintIntent.updateMany({ id: intent.id, status: 'QUOTED' }, { $set: { status: 'PREPARED', unsigned_transaction: transactionBase64, message_hash: messageHash, last_valid_block_height: latest.value.lastValidBlockHeight } });
  const { items } = await base44.entities.PartnerMintIntent.filter({ id: intent.id }, { limit: 1 });
  const saved = items[0];
  if (saved?.status !== 'PREPARED') fault('INTENT_CONFLICT', 409);
  const prepared = VersionedTransaction.deserialize(unb64(saved.unsigned_transaction));
  return { intentId: intent.id, status: 'PREPARED', transactionBase64: saved.unsigned_transaction, blockhash: prepared.message.recentBlockhash, lastValidBlockHeight: saved.last_valid_block_height, quote: q, ...await partnerMintCosts(url, saved) };
}