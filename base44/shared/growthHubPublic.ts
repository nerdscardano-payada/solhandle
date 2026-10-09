import { xpTotals, levelFor } from './growthHubLedger.ts';
export async function growthPublic(entities, body) {
  if (body.action === 'catalog') {
    const query = { status: 'PUBLISHED' };
    if (body.category && ['GETTING_STARTED', 'KNOWLEDGE', 'USE_PRODUCT'].includes(body.category)) query.category = body.category;
    if (body.search) query.title = { $regex: String(body.search).slice(0, 80).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
    const [quests, seasons, participants] = await Promise.all([entities.GrowthHubQuest.filter(query, { sort: 'created_date', limit: 20, cursor: body.cursor || undefined, fields: ['slug', 'title', 'description', 'category', 'handler', 'xp', 'status', 'version', 'frequency', 'starts_at', 'ends_at', 'retroactive_allowed', 'min_amount_lamports'] }), entities.GrowthHubSeason.filter({}, { sort: '-created_date', limit: 20, fields: ['slug', 'name', 'status', 'duration_days', 'proposed_budget_tokens', 'rules_version', 'starts_at', 'ends_at', 'payouts_enabled'] }), entities.GrowthHubProfile.count({ status: 'ACTIVE' })]);
    return { quests, seasons: seasons.items, participants, mode: 'PILOT', payouts_enabled: false };
  }
  if (body.action === 'leaderboard') {
    let season = null; const query = {};
    if (body.season_id) { season = await entities.GrowthHubSeason.get(String(body.season_id)); if (!season) throw new Error('Seizoen niet gevonden.'); query.season_id = season.id; }
    const rows = await xpTotals(entities, query), totals = new Map();
    for (const row of rows) totals.set(row.wallet, (totals.get(row.wallet) || 0) + Number(row.max_delta || 0));
    const wallets = [...totals.keys()];
    if (!wallets.length) return { items: [], season, mode: 'PILOT' };
    const profiles = await entities.GrowthHubProfile.filter({ wallet: { $in: wallets }, show_on_leaderboard: true, status: 'ACTIVE' }, { limit: 1000, fields: ['wallet'] });
    if (profiles.has_more) throw new Error('Ranglijst vereist paginering voordat meer deelnemers getoond kunnen worden.');
    return { items: profiles.items.map(p => ({ wallet: p.wallet, xp: totals.get(p.wallet), level: levelFor(totals.get(p.wallet)).number })).sort((a, b) => b.xp - a.xp || a.wallet.localeCompare(b.wallet)).slice(0, 50), season, mode: 'PILOT' };
  }
  throw new Error('Onbekende publieke actie.');
}