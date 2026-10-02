import { Transaction, PublicKey, ComputeBudgetProgram } from 'npm:@solana/web3.js@1.98.4';
import { rpc } from './solanaRpc.ts';
import { readPartnerState, assertFresh } from './partnerMintChain.ts';
import { b64, unb64, sha, fault, mintInstructions } from './partnerMintCodec.ts';
export default async function preparePartnerMint(base44, intent, url, signer) {
  if (!['QUOTED', 'PREPARED'].includes(intent.status)) fault('INTENT_NOT_PREPARABLE', 409);
  const q = intent.quote, state = await readPartnerState(url, { handle: q.handle, partnerId: q.partnerId, wallet: q.wallet }, signer);
  assertFresh(q, state);
  if (intent.status === 'PREPARED') {
    const height = await rpc(url, 'getBlockHeight', [{ commitment: 'confirmed' }]);
    if (height > intent.last_valid_block_height) fault('BLOCKHASH_EXPIRED', 410);
    return { intentId: intent.id, status: 'PREPARED', transactionBase64: intent.unsigned_transaction, lastValidBlockHeight: intent.last_valid_block_height, quote: q };
  }
  const latest = await rpc(url, 'getLatestBlockhash', [{ commitment: 'confirmed' }]);
  const transaction = new Transaction({ feePayer: new PublicKey(q.wallet), recentBlockhash: latest.value.blockhash });
  transaction.add(ComputeBudgetProgram.setComputeUnitLimit({ units: 500000 }), ...await mintInstructions(q, signer));
  const transactionBase64 = b64(transaction.serialize({ requireAllSignatures: false, verifySignatures: false }));
  const simulation = await rpc(url, 'simulateTransaction', [transactionBase64, { encoding: 'base64', sigVerify: false, commitment: 'confirmed' }]);
  if (!simulation?.value || simulation.value.err) fault('SIMULATION_FAILED', 422, 'Devnet simulation failed. Check funds, deployed program and partner configuration; no transaction was sent.');
  const messageHash = b64(await sha(transaction.serializeMessage()));
  await base44.entities.PartnerMintIntent.updateMany({ id: intent.id, status: 'QUOTED' }, { $set: { status: 'PREPARED', unsigned_transaction: transactionBase64, message_hash: messageHash, last_valid_block_height: latest.value.lastValidBlockHeight } });
  const { items } = await base44.entities.PartnerMintIntent.filter({ id: intent.id }, { limit: 1 });
  const saved = items[0];
  if (saved?.status !== 'PREPARED') fault('INTENT_CONFLICT', 409);
  const prepared = Transaction.from(unb64(saved.unsigned_transaction));
  const fee = await rpc(url, 'getFeeForMessage', [b64(prepared.serializeMessage()), { commitment: 'confirmed' }]);
  return { intentId: intent.id, status: 'PREPARED', transactionBase64: saved.unsigned_transaction, blockhash: prepared.recentBlockhash, lastValidBlockHeight: saved.last_valid_block_height, quote: q, estimatedNetworkFeeLamports: fee?.value === null ? null : String(fee.value), rentAndStorageIncludedInMintPrice: false, simulationUnitsConsumed: simulation.value.unitsConsumed };
}