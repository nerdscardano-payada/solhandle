import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { secrets } from 'base44:runtime';
import { getAssetOwnersBatch, getPrimaryHandle } from '../../shared/solanaRpc.ts';

export default async function(req: Request): Promise<Response> {
  try {
    const { wallet } = await req.json();
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(String(wallet || ''))) return Response.json({ error: 'Invalid Solana wallet.' }, { status: 400 });
    const base44 = createClientFromRequest(req);
    const records = await base44.asServiceRole.entities.HandleIndex.filter({ status: 'active' }, '-minted_at', 100);
    const rpcUrl = secrets.get('SOLANA_RPC_URL');
    const [primary, owners] = await Promise.all([getPrimaryHandle(rpcUrl, wallet), getAssetOwnersBatch(rpcUrl, records)]);
    const verifiedAt = new Date().toISOString();
    const updates = records.filter((record) => owners.get(record.asset_address) && owners.get(record.asset_address) !== record.current_owner_cached).map((record) => ({ id: record.id, current_owner_cached: owners.get(record.asset_address), last_chain_sync: verifiedAt }));
    if (updates.length) await base44.asServiceRole.entities.HandleIndex.bulkUpdate(updates);
    const handles = records.filter((record) => owners.get(record.asset_address) === wallet).map((record) => ({ handle: record.handle, display: record.display_handle || `@${record.handle}`, asset: record.asset_address, mintedAt: record.minted_at, verifiedAt, isPrimary: primary?.handle === record.handle && primary?.assetAddress === record.asset_address }));
    console.info('getOwnerHandles RPC calls', { rpcCalls: records.length ? 2 : 1, recordsChecked: records.length, cacheUpdates: updates.length });
    return Response.json({ wallet, handles, primaryHandle: primary?.handle || null });
  } catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
}