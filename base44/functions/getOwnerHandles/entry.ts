import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req: Request): Promise<Response> {
  try {
    const { wallet } = await req.json();
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(String(wallet || ''))) return Response.json({ error: 'Invalid Solana wallet.' }, { status: 400 });
    const base44 = createClientFromRequest(req);
    const records = await base44.asServiceRole.entities.HandleIndex.filter({ current_owner_cached: wallet, status: 'active' }, '-minted_at', 100);
    return Response.json({ wallet, handles: records.map(record => ({ handle: record.handle, display: record.display_handle || `@${record.handle}`, asset: record.asset_address, mintedAt: record.minted_at })) });
  } catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
}