import bs58 from 'npm:bs58@5.0.0';
import { rpc } from './solanaRpc.ts';
import { fault } from './partnerMintCodec.ts';
import registrySigned from './partnerMintRegistrySigned.ts';
import { registryState, syncRegistryProfile } from './partnerMintRegistryState.ts';
export default async function registryTransaction(base44, user, body, url) {
  if (typeof body.intentId !== 'string' || !/^[a-f0-9]{24}$/.test(body.intentId)) fault('INVALID_INTENT', 400);
  const page = await base44.entities.PartnerMintAdminIntent.filter({ id: body.intentId, admin_user_id: user.id, cluster: 'devnet' }, { limit: 1 });
  const intent = page.items[0]; if (!intent) fault('INTENT_NOT_FOUND', 404);
  if (body.action === 'submit') {
    const tx = await registrySigned(body.signedTransaction, intent), signature = bs58.encode(tx.signatures[0]);
    if (intent.signature && intent.signature !== signature) fault('INTENT_CONFLICT', 409);
    if (!intent.signature && intent.status !== 'PREPARED') fault('INTENT_NOT_PREPARED', 409);
    if (intent.signature) {
      const current = await registryTransaction(base44, user, { action: 'status', intentId: intent.id }, url);
      if (current.status !== 'PENDING' || await rpc(url, 'getBlockHeight', [{ commitment: 'confirmed' }]) > intent.last_valid_block_height) return current;
    }
    if (await rpc(url, 'getBlockHeight', [{ commitment: 'confirmed' }]) > intent.last_valid_block_height) fault('BLOCKHASH_EXPIRED', 410);
    const simulation = await rpc(url, 'simulateTransaction', [body.signedTransaction, { encoding: 'base64', sigVerify: true, commitment: 'confirmed' }]);
    if (!simulation?.value || simulation.value.err) fault('REGISTRY_SIMULATION_FAILED', 422, 'Signed registry change failed simulation; nothing broadcast.');
    await base44.entities.PartnerMintAdminIntent.updateMany({ id: intent.id, status: 'PREPARED' }, { $set: { status: 'SUBMITTED', signature } });
    const saved = await base44.entities.PartnerMintAdminIntent.get(intent.id); if (saved.signature !== signature) fault('INTENT_CONFLICT', 409);
    const returned = await rpc(url, 'sendTransaction', [body.signedTransaction, { encoding: 'base64', preflightCommitment: 'confirmed', maxRetries: 2 }]);
    if (returned !== signature) fault('RPC_SIGNATURE_MISMATCH', 503);
    return { intentId: intent.id, signature, status: 'PENDING' };
  }
  if (!intent.signature) {
    const expired = await rpc(url, 'getBlockHeight', [{ commitment: 'confirmed' }]) > intent.last_valid_block_height;
    if (expired && intent.status !== 'EXPIRED') await base44.entities.PartnerMintAdminIntent.update(intent.id, { status: 'EXPIRED' });
    return { intentId: intent.id, signature: null, status: expired ? 'EXPIRED' : intent.status };
  }
  const statuses = await rpc(url, 'getSignatureStatuses', [[intent.signature], { searchTransactionHistory: true }]), state = statuses?.value?.[0];
  if (state?.err) { await base44.entities.PartnerMintAdminIntent.update(intent.id, { status: 'FAILED' }); return { intentId: intent.id, signature: intent.signature, status: 'FAILED' }; }
  if (!['confirmed', 'finalized'].includes(state?.confirmationStatus)) return { intentId: intent.id, signature: intent.signature, status: 'PENDING' };
  const tx = await rpc(url, 'getTransaction', [intent.signature, { encoding: 'base64', commitment: state.confirmationStatus, maxSupportedTransactionVersion: 0 }]);
  if (!tx?.meta || tx.meta.err || !tx.transaction?.[0]) fault('CONFIRMATION_UNAVAILABLE', 503);
  const signed = await registrySigned(tx.transaction[0], intent); if (bs58.encode(signed.signatures[0]) !== intent.signature) fault('TRANSACTION_MISMATCH', 503);
  const status = state.confirmationStatus === 'finalized' ? 'FINALIZED' : 'CONFIRMED';
  if (status === 'FINALIZED') { const chain = await registryState(url, intent.partner_id, 'finalized', tx.slot); if (intent.partner_id) await syncRegistryProfile(base44, chain, intent.partner_id, intent.display_name, intent.desired_state.partnerLink); }
  await base44.entities.PartnerMintAdminIntent.update(intent.id, { status });
  return { intentId: intent.id, signature: intent.signature, status };
}