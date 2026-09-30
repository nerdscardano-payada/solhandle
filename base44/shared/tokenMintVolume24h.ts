import { HANDLE_MINT } from './handlePaymentStatus.ts';

export async function tokenMintStats24h(base44, wallet = null) {
  const now = new Date();
  const query = {
    token_mint: HANDLE_MINT,
    confirmed_at: { $gte: new Date(now.getTime() - 86400000).toISOString(), $lte: now.toISOString() },
    ...(wallet ? { wallet } : {})
  };
  const result = await base44.asServiceRole.entities.TokenMintPayment.aggregate({ query, sum: ['total_tokens', 'burned_tokens'] });
  return {
    mintVolume24hHandle: Number(result.rows?.[0]?.sum_total_tokens || 0),
    burned24hHandle: Number(result.rows?.[0]?.sum_burned_tokens || 0)
  };
}

export default async function tokenMintVolume24h(base44, wallet = null) {
  return (await tokenMintStats24h(base44, wallet)).mintVolume24hHandle;
}