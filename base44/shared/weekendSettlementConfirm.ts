import { rpc } from './solanaRpc.ts';
import { CAMPAIGN } from './weekendCampaign.ts';
export async function confirmWeekendSettlement(client, url, intent) {
  if (!intent.signature) return { status: intent.status, intent_id: intent.id };
  let statuses = await rpc(url, 'getSignatureStatuses', [[intent.signature], { searchTransactionHistory: true }]);
  let status = statuses.value?.[0];
  const expiredHeight = !status && await rpc(url, 'getBlockHeight', [{ commitment: 'finalized' }]) > intent.last_valid_height;
  if (expiredHeight) {
    // Read again after the finalized height check so a just-landed transaction is not expired.
    statuses = await rpc(url, 'getSignatureStatuses', [[intent.signature], { searchTransactionHistory: true }]);
    status = statuses.value?.[0];
  }
  const identity = { id: intent.id, signature: intent.signature, unsigned: intent.unsigned };
  const latest = await client.entities.WeekendMintIntent.get(intent.id);
  if (latest.signature !== intent.signature || latest.unsigned !== intent.unsigned) throw new Error('Settlement changed; refresh before checking it again.');
  if (status?.err) {
    await client.entities.WeekendMintIntent.updateMany(identity, { $set: { status: 'failed' } });
    return { status: 'failed', signature: intent.signature, intent_id: intent.id };
  }
  if (status?.confirmationStatus === 'finalized') {
    await client.entities.WeekendMintSettlement.upsert([{ campaign: CAMPAIGN, key: intent.key, kind: intent.kind, recipient: intent.recipient, tokens: intent.tokens, signature: intent.signature, confirmed_at: new Date().toISOString() }], { key: ['campaign', 'key'] });
    await client.entities.WeekendMintIntent.updateMany(identity, { $set: { status: 'confirmed' } });
    return { status: 'confirmed', signature: intent.signature, intent_id: intent.id };
  }
  if (!status && expiredHeight) {
    await client.entities.WeekendMintIntent.updateMany(identity, { $set: { status: 'expired' } });
    return { status: 'expired', signature: intent.signature, intent_id: intent.id };
  }
  return { status: 'submitted', signature: intent.signature, intent_id: intent.id };
}