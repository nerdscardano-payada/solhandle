export async function growthAdmin(entities, user, body) {
  if (body.action === 'overview') {
    const [quests, seasons, audits, participants, credits] = await Promise.all([entities.GrowthHubQuest.filter({}, { sort: 'created_date', limit: 50 }), entities.GrowthHubSeason.filter({}, { sort: '-created_date', limit: 20 }), entities.GrowthHubAudit.filter({}, { sort: '-occurred_at', limit: 20 }), entities.GrowthHubProfile.count({ status: 'ACTIVE' }), entities.GrowthHubXP.aggregate({ countDistinct: 'completion_key' })]);
    return { quests: quests.items, seasons: seasons.items, audits: audits.items, participants, completions: credits.rows[0]?.count_distinct_completion_key || 0, payouts_enabled: false };
  }
  const now = new Date().toISOString(); let before, after;
  if (body.action === 'save_quest') {
    before = await entities.GrowthHubQuest.get(String(body.id));
    if (!before || before.status === 'PUBLISHED') throw new Error('Pauzeer de quest voordat je een nieuwe versie opslaat.');
    const xp = Number(body.xp), title = String(body.title || '').trim(), description = String(body.description || '').trim();
    if (!Number.isSafeInteger(xp) || xp < 1 || xp > 1000 || title.length < 3 || title.length > 100 || description.length < 10 || description.length > 2000) throw new Error('Controleer titel, uitleg en XP (1–1.000).');
    const minimum = before.handler === 'ON_CHAIN_PAY' ? Number(body.min_amount_lamports) : 0;
    if (!Number.isSafeInteger(minimum) || minimum < (before.handler === 'ON_CHAIN_PAY' ? 1 : 0)) throw new Error('Stel een geldig minimaal SOL-bedrag in voor de betaalquest.');
    after = await entities.GrowthHubQuest.update(before.id, { title, description, xp, min_amount_lamports: minimum, version: before.version + 1, status: 'DRAFT' });
  } else if (body.action === 'quest_status') {
    before = await entities.GrowthHubQuest.get(String(body.id));
    if (!before || !['PUBLISHED', 'PAUSED'].includes(body.status) || !['PROFILE', 'KNOWLEDGE_QUIZ', 'ON_CHAIN_MINT', 'ON_CHAIN_TOKEN_MINT', 'ON_CHAIN_PAY'].includes(before.handler)) throw new Error('Ongeldige questwijziging.');
    if (body.status === 'PUBLISHED' && before.handler === 'ON_CHAIN_PAY' && (!Number.isSafeInteger(before.min_amount_lamports) || before.min_amount_lamports < 1)) throw new Error('Publicatie vereist een vastgelegd minimaal betaalbedrag.');
    after = await entities.GrowthHubQuest.update(before.id, { status: body.status });
  } else if (body.action === 'save_season') {
    before = await entities.GrowthHubSeason.get(String(body.id));
    if (!before || before.status !== 'DRAFT') throw new Error('Alleen een conceptseizoen kan worden aangepast.');
    const duration_days = Number(body.duration_days), name = String(body.name || '').trim(), budget = String(body.proposed_budget_tokens || '');
    if (!Number.isInteger(duration_days) || duration_days < 1 || duration_days > 90 || name.length < 3 || name.length > 100 || !/^\d{1,12}$/.test(budget)) throw new Error('Controleer naam, duur en voorgesteld budget.');
    after = await entities.GrowthHubSeason.update(before.id, { name, duration_days, proposed_budget_tokens: budget, payouts_enabled: false });
  } else if (body.action === 'season_status') {
    before = await entities.GrowthHubSeason.get(String(body.id));
    const allowed = { DRAFT: ['ACTIVE'], ACTIVE: ['PAUSED', 'ENDED'], PAUSED: ['ACTIVE', 'ENDED'], ENDED: [] };
    if (!before || !allowed[before.status]?.includes(body.status)) throw new Error('Ongeldige seizoensovergang.');
    if (body.status === 'ACTIVE' && await entities.GrowthHubSeason.count({ status: 'ACTIVE', id: { $ne: before.id } })) throw new Error('Er is al een actief seizoen.');
    if (before.status === 'PAUSED' && body.status === 'ACTIVE' && Date.parse(before.ends_at) <= Date.now()) throw new Error('Het seizoen is afgelopen.');
    const dates = before.status === 'DRAFT' ? { starts_at: now, ends_at: new Date(Date.now() + before.duration_days * 86400000).toISOString() } : {};
    after = await entities.GrowthHubSeason.update(before.id, { ...dates, status: body.status, payouts_enabled: false });
  } else throw new Error('Onbekende beheeractie.');
  await entities.GrowthHubAudit.create({ admin_id: user.id, action: body.action, target_id: before.id, before, after, occurred_at: now });
  return { ok: true, record: after };
}