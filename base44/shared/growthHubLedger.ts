export const levels = [{ title: 'Newcomer', xp: 0 }, { title: 'Explorer', xp: 500 }, { title: 'Supporter', xp: 1500 }, { title: 'Ambassador', xp: 4000 }, { title: 'Legend', xp: 10000 }];
export function levelFor(xp) { const index = levels.findLastIndex(l => xp >= l.xp); return { number: index + 1, ...levels[index], next: levels[index + 1] || null }; }
export async function xpTotals(entities, query) {
  // Canonical completion groups, not raw rows, prevent retries from inflating pilot XP.
  // This is not a multi-record transaction and is never used to authorize payouts.
  const result = await entities.GrowthHubXP.aggregate({ query, groupBy: ['wallet', 'completion_key'], max: 'delta', limit: 1000 });
  if (result.truncated) throw new Error('XP-overzicht vereist een grotere serveraggregatie. Geen onvolledig totaal wordt getoond.');
  return result.rows;
}
export async function activeSeason(entities) {
  const page = await entities.GrowthHubSeason.filter({ status: 'ACTIVE', starts_at: { $lte: new Date().toISOString() }, ends_at: { $gt: new Date().toISOString() } }, { limit: 2 });
  if (page.items.length > 1) throw new Error('Meerdere actieve seizoenen. Neem contact op met beheer.');
  return page.items[0] || null;
}
export async function publishedQuest(entities, slug) {
  const page = await entities.GrowthHubQuest.filter({ slug, status: 'PUBLISHED' }, { limit: 2 });
  if (page.items.length !== 1) throw new Error('Quest is niet beschikbaar.');
  const q = page.items[0], now = Date.now();
  if ((q.starts_at && Date.parse(q.starts_at) > now) || (q.ends_at && Date.parse(q.ends_at) <= now)) throw new Error('Quest valt buiten het actieve tijdsvenster.');
  return q;
}
export async function creditPilotXP(entities, profile, quest, evidence = null) {
  const completion_key = `${profile.wallet}:${quest.slug}:LIFETIME`;
  const existing = await entities.GrowthHubXP.filter({ completion_key }, { sort: 'credited_at', limit: 1 });
  if (existing.items.length) return { completed: true, already_completed: true, xp: existing.items[0].delta };
  const season = await activeSeason(entities);
  await entities.GrowthHubXP.create({ completion_key, wallet: profile.wallet, quest_id: quest.id, quest_slug: quest.slug, quest_title: quest.title, quest_version: quest.version, season_id: season?.id || '', delta: quest.xp, reward_eligible_delta: 0, source_id: evidence ? `solana:mainnet-beta:${evidence.signature}:${evidence.kind}` : `${quest.handler}:${profile.wallet}`, reason: evidence ? 'Finalized on-chain bewijs, server-gecontroleerde pilotquest' : 'Server-gecontroleerde pilotquest', ...(evidence ? { chain_evidence: evidence } : {}), credited_at: new Date().toISOString(), mode: 'PILOT' });
  return { completed: true, already_completed: false, xp: quest.xp };
}
export async function personalOverview(entities, profile) {
  const [lifetime, season, history] = await Promise.all([xpTotals(entities, { wallet: profile.wallet }), activeSeason(entities), entities.GrowthHubXP.filter({ wallet: profile.wallet }, { sort: '-credited_at', limit: 50 })]);
  const lifetime_xp = lifetime.reduce((total, row) => total + Number(row.max_delta || 0), 0);
  const current = season ? await xpTotals(entities, { wallet: profile.wallet, season_id: season.id }) : [];
  return { profile: { wallet: profile.wallet, show_on_leaderboard: profile.show_on_leaderboard, joined_at: profile.joined_at }, lifetime_xp, season_xp: current.reduce((total, row) => total + Number(row.max_delta || 0), 0), reward_eligible_xp: 0, level: levelFor(lifetime_xp), completed_keys: lifetime.map(row => row.completion_key), season, history, mode: 'PILOT', payouts_enabled: false };
}