import { getAssetOwnersBatch } from './solanaRpc.ts';

export async function getOwnedActiveHandles(base44, rpcUrl, wallet) {
  const pageSize = 500;
  const owned = [];
  let skip = 0;
  while (true) {
    const records = await base44.asServiceRole.entities.HandleIndex.filter({ status: 'active' }, '-created_date', pageSize, skip);
    if (!records.length) break;
    const owners = new Map();
    for (let i = 0; i < records.length; i += 100) {
      const batchOwners = await getAssetOwnersBatch(rpcUrl, records.slice(i, i + 100));
      for (const [asset, owner] of batchOwners) owners.set(asset, owner);
    }
    const verifiedAt = new Date().toISOString();
    const updates = records
      .filter((record) => owners.get(record.asset_address) && owners.get(record.asset_address) !== record.current_owner_cached)
      .map((record) => ({ id: record.id, current_owner_cached: owners.get(record.asset_address), last_chain_sync: verifiedAt }));
    if (updates.length) await base44.asServiceRole.entities.HandleIndex.bulkUpdate(updates);
    owned.push(...records
      .filter((record) => owners.get(record.asset_address) === wallet)
      .map((record) => ({ handle: record.handle, display: record.display_handle || `@${record.handle}`, asset: record.asset_address, imageUri: record.image_uri || "", mintedAt: record.minted_at, verifiedAt, rarity: record.rarity, nameClass: record.name_class })));
    if (records.length < pageSize) break;
    skip += records.length;
  }
  return owned;
}