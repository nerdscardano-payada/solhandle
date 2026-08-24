import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const [latest, activeHandles] = await Promise.all([
      base44.asServiceRole.entities.ProtocolStatus.list('-last_sync', 1),
      base44.asServiceRole.entities.HandleIndex.filter({ status: 'active' }, '-minted_at', 500)
    ]);
    const config = latest[0];
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    const activeHolders = new Set(activeHandles.map((record) => record.current_owner_cached).filter(Boolean)).size;
    const recentClaims = activeHandles.filter((record) => record.minted_at && new Date(record.minted_at).getTime() >= cutoff).length;
    return Response.json({ totalMinted: config?.total_minted ?? activeHandles.length, activeHolders, recentClaims, collection: config?.collection ?? null, paused: config?.paused ?? null, lastSync: config?.last_sync ?? null });
  } catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
}