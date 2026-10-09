import { walletAddress, getProfile } from './growthHubIdentity.ts';
import { publishedQuest, creditPilotXP } from './growthHubLedger.ts';
import { questProof } from './growthHubQuestProof.ts';
import { questRisk } from './growthHubFraud.ts';
export async function growthReviewAdmin(entities, user, body) {
  if (body.action === 'review_queue') {
    const query = body.status === 'ALL' ? {} : { status: body.status === 'PENDING' || !body.status ? { $in: ['PENDING','APPROVING'] } : body.status };
    if (!['ALL','PENDING','APPROVED','REJECTED',undefined].includes(body.status)) throw new Error('Ongeldig reviewfilter.');
    return entities.GrowthHubReview.filter(query, { sort: '-submitted_at', limit: 20, cursor: body.cursor || undefined });
  }
  const note = String(body.note || '').trim();
  if (note.length < 10 || note.length > 1000) throw new Error('Vermeld een interne beslisreden van 10–1.000 tekens.');
  if (body.action === 'profile_status') {
    if (!['ACTIVE','HELD'].includes(body.status)) throw new Error('Ongeldige profielstatus.');
    const before = await getProfile(entities, walletAddress(body.wallet));
    if (!before) throw new Error('Growth Hub-profiel niet gevonden.');
    const after = await entities.GrowthHubProfile.update(before.id, { status: body.status });
    await entities.GrowthHubAudit.create({ admin_id: user.id, action: 'profile_status', target_id: before.id, before, after: { ...after, decision_note: note }, occurred_at: new Date().toISOString() });
    return { ok: true };
  }
  if (!['approve_review','reject_review','reopen_review'].includes(body.action)) throw new Error('Onbekende reviewactie.');
  const before = await entities.GrowthHubReview.get(String(body.id || ''));
  if (!before) throw new Error('Review niet gevonden.');
  if (before.status === 'APPROVED') return { ok: true, already_decided: true };
  if (before.status === 'APPROVING' && Date.parse(before.lease_until) > Date.now()) throw new Error('Een beheerbeslissing wordt al verwerkt. Probeer later opnieuw.');
  if (body.action === 'reopen_review') {
    if (before.status !== 'REJECTED') throw new Error('Alleen afgewezen reviews kunnen worden heropend.');
    const after = await entities.GrowthHubReview.update(before.id, { status:'PENDING', decision_note:note, decided_by:user.id, decided_at:new Date().toISOString() });
    await audit(entities,user,before,after,body.action); return {ok:true};
  }
  if (!['PENDING','APPROVING'].includes(before.status)) throw new Error('Heropen eerst de afgewezen review.');
  if (body.action === 'reject_review' && await entities.GrowthHubXP.count({completion_key:before.review_key})) throw new Error('Er is al XP geboekt voor deze quest. Herstel de review via goedkeuring; afwijzing verwijdert geen bestaande XP.');
  let profile, quest, result;
  if (body.action === 'approve_review') {
    profile = await getProfile(entities, before.wallet);
    if (!profile || profile.status !== 'ACTIVE') throw new Error('Dit profiel staat niet actief; hef de hold eerst gemotiveerd op.');
    quest = await publishedQuest(entities, before.quest_slug);
    if (quest.id !== before.quest_id || quest.version !== before.quest_version) throw new Error('De questversie is gewijzigd; dit bewijs kan niet onder de nieuwe regels worden goedgekeurd.');
    result = await questProof(entities, profile, quest, before.signature);
    if (result.pending) throw new Error('Finalized bewijs ontbreekt nog. Er is geen XP toegekend.');
    await questRisk(entities, before.wallet, result.evidence, result.conversion_id);
  }
  const token = crypto.randomUUID(), now = new Date().toISOString();
  await entities.GrowthHubReview.updateMany({ id:before.id, status:before.status, updated_date:before.updated_date }, { $set:{ status:'APPROVING', processing_token:token, lease_until:new Date(Date.now()+120000).toISOString() } });
  const claimed = await entities.GrowthHubReview.get(before.id);
  if (claimed.processing_token !== token) throw new Error('Een andere beheerder verwerkt deze review.');
  try {
    await audit(entities,user,before,{status:'APPROVING',processing_token:token,decision_note:note},body.action);
    if (body.action === 'approve_review') await creditPilotXP(entities, profile, quest, result.evidence);
    const after = await entities.GrowthHubReview.update(before.id,{ status:body.action === 'approve_review' ? 'APPROVED':'REJECTED', decided_by:user.id, decided_at:now, decision_note:note, processing_token:'', lease_until:'' });
    await audit(entities,user,claimed,after,`${body.action}_completed`); return {ok:true};
  } catch(error) {
    await entities.GrowthHubReview.updateMany({id:before.id,status:'APPROVING',processing_token:token},{$set:{status:'PENDING',processing_token:'',lease_until:''}});
    throw error;
  }
}
async function audit(entities,user,before,after,action) { await entities.GrowthHubAudit.create({admin_id:user.id,action,target_id:before.id,before,after,occurred_at:new Date().toISOString()}); }