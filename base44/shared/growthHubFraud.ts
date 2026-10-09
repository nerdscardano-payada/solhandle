export async function questRisk(entities, wallet, evidence = null, conversionId = '') {
  const subjects = [wallet, evidence?.original_minter, evidence?.recipient].filter(Boolean);
  const profiles = await entities.ReferralProfile.filter({ wallet_address: { $in: subjects } }, { limit: 50, fields: ['status'] });
  if (profiles.has_more) throw new Error('Te veel gekoppelde referralprofielen; beheercontrole vereist.');
  const queries = [{ conversion_id: conversionId || '__none__' }];
  if (profiles.items.length) queries.push({ referral_profile_id: { $in: profiles.items.map(p => p.id) } });
  const flags = await entities.FraudFlag.filter({ status: { $in: ['OPEN', 'BLOCKED'] }, $or: queries }, { limit: 50, fields: ['reason','severity','status','conversion_id','referral_profile_id'] });
  const held = await entities.GrowthHubProfile.count({ wallet: { $in: subjects }, status: 'HELD' });
  if (held || flags.has_more || flags.items.some(f => f.status === 'BLOCKED') || profiles.items.some(p => ['SUSPENDED','BANNED'].includes(p.status))) throw new Error('Deze quest vereist eerst oplossing van een bestaande profiel- of fraudeblokkering. Er is geen XP toegekend.');
  return { flags: flags.items, reasons: flags.items.map(f => `${f.reason} · ${f.severity}`), review: flags.items.length > 0 };
}
export async function getQuestReview(entities, wallet, slug) {
  const page = await entities.GrowthHubReview.filter({ review_key: `${wallet}:${slug}:LIFETIME` }, { limit: 2 });
  if (page.items.length > 1) throw new Error('Dubbele reviewregistratie vereist beheercontrole.');
  return page.items[0] || null;
}
export async function queueQuestReview(entities, profile, quest, result, reasons) {
  const existing = await getQuestReview(entities, profile.wallet, quest.slug);
  if (!existing) await entities.GrowthHubReview.upsert([{
    review_key: `${profile.wallet}:${quest.slug}:LIFETIME`, wallet: profile.wallet, quest_id: quest.id, quest_slug: quest.slug, quest_title: quest.title, quest_version: quest.version,
    status: 'PENDING', signature: result.evidence?.signature || '', conversion_id: result.conversion_id || '', evidence: result.evidence || {}, reasons, submitted_at: new Date().toISOString()
  }], { key: 'review_key' });
  return { completed: false, pending: true, review_status: existing?.status || 'PENDING', message: existing?.status === 'REJECTED' ? 'Deze inzending is afgewezen. Neem contact op met SolHandle voor bezwaar; er is geen XP toegekend.' : 'Je bewijs staat in de fraudereview. XP wordt pas na goedkeuring door beheer toegekend; je hoeft geen nieuwe transactie uit te voeren.' };
}