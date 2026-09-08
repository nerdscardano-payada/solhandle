import { getAssetOwnersBatch } from './solanaRpc.ts';

export async function getOwnedActiveHandles(base44, rpcUrl, wallet) {
  const records = await base44.asServiceRole.entities.HandleIndex.filter({ status: 'active' }, '-minted_at', 100);
  const owners = await getAssetOwnersBatch(rpcUrl, records);
  const verifiedAt = new Date().toISOString();
  const updates = records
    .filter((record) => owners.get(record.asset_address) && owners.get(record.asset_address) !== record.current_owner_cached)
    .map((record) => ({ id: record.id, current_owner_cached: owners.get(record.asset_address), last_chain_sync: verifiedAt }));
  if (updates.length) await base44.asServiceRole.entities.HandleIndex.bulkUpdate(updates);
  return records
    .filter((record) => owners.get(record.asset_address) === wallet)
    .map((record) => ({ handle: record.handle, display: record.display_handle || `@${record.handle}`, asset: record.asset_address, mintedAt: record.minted_at, verifiedAt, rarity: record.rarity, nameClass: record.name_class }));
}