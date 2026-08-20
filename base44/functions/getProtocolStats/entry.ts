import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const latest = await base44.asServiceRole.entities.ProtocolStatus.list('-last_sync', 1);
    const config = latest[0];
    return Response.json({ totalMinted: config?.total_minted ?? null, collection: config?.collection ?? null, paused: config?.paused ?? null, lastSync: config?.last_sync ?? null });
  } catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
}