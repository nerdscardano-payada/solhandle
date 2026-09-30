import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { HANDLE_MINT } from '../../shared/handlePaymentStatus.ts';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    if (body.cursor != null && (typeof body.cursor !== 'string' || body.cursor.length > 4096)) return Response.json({ error: 'Invalid page cursor.' }, { status: 400 });
    // Intentionally public, read-only reporting, like flywheelStats. Never expose admin records wholesale.
    const entities = base44.asServiceRole.entities;
    const query = { type: 'BURN', token_mint: HANDLE_MINT };
    const [page, totals, mintCount] = await Promise.all([
      entities.BurnActivity.filter(query, { sort: '-block_time', limit: 50, ...(body.cursor ? { cursor: body.cursor } : {}), fields: ['signature', 'token_amount', 'block_time', 'growth_cycle_number'] }),
      body.cursor ? null : entities.BurnActivity.aggregate({ query, sum: 'token_amount', max: 'block_time' }),
      body.cursor ? null : entities.TokenMintPayment.count({ token_mint: HANDLE_MINT }),
    ]);
    const signatures = page.items.map(item => item.signature);
    const mintProofs = signatures.length ? await entities.TokenMintPayment.filter({ token_mint: HANDLE_MINT, signature: { $in: signatures } }, { limit: 50, fields: ['signature', 'handle'] }) : { items: [] };
    const handles = new Map(mintProofs.items.map(item => [item.signature, item.handle]));
    const total = totals?.rows?.[0];
    return Response.json({
      stats: body.cursor ? null : { totalBurned: total?.sum_token_amount || 0, burnTransactions: total?.count || 0, automaticMints: mintCount, lastBurn: total?.max_block_time || null, measuredAt: new Date().toISOString() },
      items: page.items.map(item => ({ signature: item.signature, amount: item.token_amount, occurredAt: item.block_time, source: handles.has(item.signature) ? 'mint' : item.growth_cycle_number != null ? 'growth' : 'recorded', handle: handles.get(item.signature) || null, cycle: item.growth_cycle_number ?? null })),
      nextCursor: page.next_cursor,
      hasMore: page.has_more,
    });
  } catch (error) {
    return Response.json({ error: error.message || 'Burn dashboard unavailable.' }, { status: 500 });
  }
}