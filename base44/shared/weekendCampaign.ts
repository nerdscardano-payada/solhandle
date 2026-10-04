export const CAMPAIGN = 'mint-weekend-2026-10-03';
// Extended by 24 hours: Saturday 00:00 to Tuesday 00:00, Europe/Berlin (UTC+2).
export const START = '2026-10-02T22:00:00.000Z';
export const END = '2026-10-05T22:00:00.000Z';
export const campaignQuery = { campaign: CAMPAIGN };
export async function weekendSnapshot(client) {
  const [scan, totals, leaders, settlements] = await Promise.all([
    client.entities.WeekendMintScan.filter(campaignQuery, { limit: 1 }),
    client.entities.WeekendMintProof.aggregate({ query: campaignQuery, countDistinct: 'wallet' }),
    client.entities.WeekendMintProof.aggregate({ query: campaignQuery, groupBy: 'wallet', min: 'order', sort: 'min_order', limit: 25 }),
    client.entities.WeekendMintSettlement.filter(campaignQuery, { limit: 50 })
  ]);
  const orders = (leaders.rows || []).map(row => row.min_order);
  const proofs = orders.length ? (await client.entities.WeekendMintProof.filter({ ...campaignQuery, order: { $in: orders } }, { sort: 'order', limit: 25 })).items : [];
  return { campaign: CAMPAIGN, start: START, end: END, timezone: 'Europe/Berlin', scan: scan.items[0] ? { complete: scan.items[0].complete, final: scan.items[0].final, checked_at: scan.items[0].checked_at, finalized_through: scan.items[0].finalized_through, error: scan.items[0].error } : null, mintCount: totals.rows?.[0]?.count || 0, winners: proofs.map((row, i) => ({ ...row, rank: i + 1, reward: 100000 })), settlements: settlements.items };
}