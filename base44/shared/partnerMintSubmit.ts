import partnerMintSigned from './partnerMintSigned.ts';
import bs58 from 'npm:bs58@5.0.0';
import { rpc } from './solanaRpc.ts';
import { fault } from './partnerMintCodec.ts';
import { readPartnerState, assertFresh } from './partnerMintChain.ts';
import partnerMintStatus from './partnerMintStatus.ts';
export default async function submitPartnerMint(base44, intent, url, signer, signedTransaction) {
  const transaction = await partnerMintSigned(signedTransaction, intent);
  const signature = bs58.encode(transaction.signatures[0]);
  if (intent.transaction_signature && intent.transaction_signature !== signature) fault('INTENT_CONFLICT', 409);
  if (intent.transaction_signature) {
    const current = await partnerMintStatus(base44, intent, url);
    if (current.status !== 'PENDING') return current;
    // Uncertainty never permits a newly signed transaction. Only these same bytes can be relayed again.
    if (await rpc(url, 'getBlockHeight', [{ commitment: 'confirmed' }]) > intent.last_valid_block_height) return current;
  } else if (intent.status !== 'PREPARED') fault('INTENT_NOT_PREPARED', 409);
  const q = intent.quote;
  const state = await readPartnerState(url, { handle: q.handle, partnerId: q.partnerId, wallet: q.wallet }, signer);
  assertFresh(q, state);
  if (await rpc(url, 'getBlockHeight', [{ commitment: 'confirmed' }]) > intent.last_valid_block_height) fault('BLOCKHASH_EXPIRED', 410);
  const simulation = await rpc(url, 'simulateTransaction', [signedTransaction, { encoding: 'base64', sigVerify: true, commitment: 'confirmed' }]);
  if (!simulation?.value || simulation.value.err) fault('SIMULATION_FAILED', 422, 'Signed Devnet transaction simulation failed; nothing broadcast.');
  assertFresh(q, await readPartnerState(url, { handle: q.handle, partnerId: q.partnerId, wallet: q.wallet }, signer));
  // Persist the locally derived signature BEFORE broadcasting, so a relay timeout remains recoverable.
  await base44.entities.PartnerMintIntent.updateMany({ id: intent.id, status: 'PREPARED' }, { $set: { status: 'SUBMITTED', transaction_signature: signature } });
  const { items } = await base44.entities.PartnerMintIntent.filter({ id: intent.id }, { limit: 1 });
  if (items[0]?.transaction_signature !== signature) fault('INTENT_CONFLICT', 409);
  const returned = await rpc(url, 'sendTransaction', [signedTransaction, { encoding: 'base64', preflightCommitment: 'confirmed', maxRetries: 2 }]);
  if (returned !== signature) fault('RPC_SIGNATURE_MISMATCH', 503);
  return { intentId: intent.id, signature, status: 'PENDING', receipt: null, retrySameTransactionOnly: true };
}