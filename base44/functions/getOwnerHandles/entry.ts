import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { secrets } from 'base44:runtime';
import { getAssetOwner, getPrimaryHandle } from '../../shared/solanaRpc.ts';

export default async function(req: Request): Promise<Response> {
  try {
    const { wallet } = await req.json();
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(String(wallet || ''))) return Response.json({ error: 'Invalid Solana wallet.' }, { status: 400 });
    const base44 = createClientFromRequest(req);
    const records = await base44.asServiceRole.entities.HandleIndex.filter({ status: 'active' }, '-minted_at', 100);
    const rpcUrl = secrets.get('SOLANA_RPC_URL');
    const primary = await getPrimaryHandle(rpcUrl, wallet);
    const handles = [];
    for (const record of records) {
      const owner = await getAssetOwner(rpcUrl, record.asset_address, record.current_owner_cached || '');
      if (owner !== record.current_owner_cached) await base44.asServiceRole.entities.HandleIndex.update(record.id, { current_owner_cached: owner, last_chain_sync: new Date().toISOString() });
      if (owner === wallet) handles.push({ handle: record.handle, display: record.display_handle || `@${record.handle}`, asset: record.asset_address, mintedAt: record.minted_at, verifiedAt: new Date().toISOString(), isPrimary: primary?.handle === record.handle && primary?.assetAddress === record.asset_address });
    }
    return Response.json({ wallet, handles, primaryHandle: primary?.handle || null });
  } catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
}