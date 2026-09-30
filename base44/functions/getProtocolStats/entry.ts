import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import tokenMintVolume24h from '../../shared/tokenMintVolume24h.ts';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const now = new Date(), cutoff = now.getTime() - 86400000;
    const [latest, activeHandles, solVolume, premiumHandles, mintVolume24hHandle] = await Promise.all([
      base44.asServiceRole.entities.ProtocolStatus.list('-last_sync', 1),
      base44.asServiceRole.entities.HandleIndex.filter({ status: 'active' }, '-minted_at', 5000),
      base44.asServiceRole.entities.FinancialTransaction.aggregate({ query: { status: 'completed', transaction_type: 'sale', timestamp: { $gte: new Date(cutoff).toISOString(), $lte: now.toISOString() } }, sum: 'total_paid_lamports' }),
      base44.asServiceRole.entities.PremiumHandle.list('-created_date', 5000),
      tokenMintVolume24h(base44)
    ]);
    const config = latest[0];
    const recentHandles = activeHandles.filter((record) => record.minted_at && Date.parse(record.minted_at) >= cutoff);
    const scarcity = { one: 0, two: 0, three: 0, four: 0, long: 0 };
    const rarityDistribution = { legendary: 0, ultraRare: 0, rare: 0, uncommon: 0, standard: 0 };
    activeHandles.forEach((record) => { const length = Number(record.length || record.handle?.length || 0); if (length === 1) { scarcity.one += 1; rarityDistribution.legendary += 1; } else if (length === 2) { scarcity.two += 1; rarityDistribution.ultraRare += 1; } else if (length === 3) { scarcity.three += 1; rarityDistribution.rare += 1; } else if (length === 4) { scarcity.four += 1; rarityDistribution.uncommon += 1; } else { scarcity.long += 1; rarityDistribution.standard += 1; } });
    const uniqueHolders = new Set(activeHandles.map((record) => record.current_owner_cached).filter(Boolean)).size;
    const mintVolume24hSol = Number(solVolume.rows?.[0]?.sum_total_paid_lamports || 0) / 1_000_000_000;
    const premiumMinted = activeHandles.filter((record) => record.name_class === 'Premium').length;
    return Response.json({ totalMinted: config?.total_minted ?? activeHandles.length, uniqueHolders, minted24h: recentHandles.length, mintVolume24hSol, mintVolume24hHandle, scarcity, rarityDistribution, premiumHandlesTotal: premiumHandles.length, premiumMinted, collection: config?.collection ?? null, paused: config?.paused ?? null, lastSync: config?.last_sync ?? null });
  } catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
}