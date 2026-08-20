import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const { limit = 6 } = await req.json();
    const base44 = createClientFromRequest(req);
    const records = await base44.asServiceRole.entities.HandleIndex.filter({ status: 'active' }, '-minted_at', Math.min(Math.max(Number(limit) || 6, 1), 12));
    return Response.json({ handles: records.map((record) => ({
      handle: record.handle,
      display: record.display_handle || `@${record.handle}`,
      asset: record.asset_address,
      mintedAt: record.minted_at
    })) });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}