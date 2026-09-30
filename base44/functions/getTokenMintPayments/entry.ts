import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { PublicKey } from 'npm:@solana/web3.js@1.98.4';
import { HANDLE_MINT } from '../../shared/handlePaymentStatus.ts';
import tokenMintVolume24h from '../../shared/tokenMintVolume24h.ts';
export default async function(req: Request): Promise<Response> {
  try {
    const body = await req.json(), base44 = createClientFromRequest(req), query = { token_mint: HANDLE_MINT };
    if (body.cursor && (typeof body.cursor !== 'string' || body.cursor.length > 4096)) throw new Error('Invalid cursor.');
    if (body.wallet) query.wallet = new PublicKey(body.wallet).toBase58();
    if (body.start || body.end) {
      query.confirmed_at = {};
      for (const [field, operator] of [['start', '$gte'], ['end', '$lt']]) {
        if (!body[field]) continue;
        const date = new Date(body[field]);
        if (!Number.isFinite(date.getTime())) throw new Error('Invalid reporting date.');
        query.confirmed_at[operator] = date.toISOString();
      }
    }
    const entities = base44.asServiceRole.entities;
    const [page, totals, mintVolume24hHandle] = await Promise.all([
      entities.TokenMintPayment.filter(query, { sort: '-confirmed_at', limit: 50, ...(body.cursor ? { cursor: body.cursor } : {}), fields: ['signature', 'handle', 'wallet', 'decimals', 'amount_raw', 'burned_raw', 'treasury_raw', 'confirmed_at'] }),
      body.cursor ? null : entities.TokenMintPayment.aggregate({ query, sum: ['total_tokens', 'burned_tokens', 'treasury_tokens'] }),
      body.cursor ? null : tokenMintVolume24h(base44, query.wallet)
    ]);
    return Response.json({ items: page.items, nextCursor: page.next_cursor, hasMore: page.has_more, totals: totals?.rows?.[0] || null, mintVolume24hHandle });
  } catch (error) { return Response.json({ error: error.message || 'Token payment history unavailable.' }, { status: 400 }); }
}