import { HANDLE_MINT } from './handlePaymentStatus.ts';

export default async function tokenMintVolume24h(base44, wallet = null) {
  const now = new Date();
  const query = {
    token_mint: HANDLE_MINT,
    confirmed_at: { $gte: new Date(now.getTime() - 86400000).toISOString(), $lte: now.toISOString() },
    ...(wallet ? { wallet } : {})
  };
  const result = await base44.asServiceRole.entities.TokenMintPayment.aggregate({ query, sum: 'total_tokens' });
  return Number(result.rows?.[0]?.sum_total_tokens || 0);
}