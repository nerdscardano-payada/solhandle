import { getProfile, requireProfile, verifiedWallet } from './growthHubIdentity.ts';
import { creditPilotXP, personalOverview, publishedQuest } from './growthHubLedger.ts';
import { gradeQuiz, publicQuiz } from './growthHubQuiz.ts';
import { chainHandlers } from './growthHubTransaction.ts';
import { questProof } from './growthHubQuestProof.ts';
import { questRisk, getQuestReview, queueQuestReview } from './growthHubFraud.ts';
export async function growthParticipant(entities, body) {
  if (body.action === 'join') {
    const wallet = await verifiedWallet(entities, body.proof); let profile = await getProfile(entities, wallet);
    if (!profile) {
      await entities.GrowthHubProfile.upsert([{ wallet, status: 'ACTIVE', show_on_leaderboard: false, joined_at: new Date().toISOString() }], { key: 'wallet' });
      profile = await getProfile(entities, wallet);
    }
    if (!['ACTIVE','HELD'].includes(profile.status)) throw new Error('Dit profiel vereist beheercontrole.');
    return personalOverview(entities, profile);
  }
  if (body.action === 'me') {
    const profile = await getProfile(entities, await verifiedWallet(entities, body.proof));
    if (!profile) throw new Error('Registreer eerst je Growth Hub-profiel.');
    return personalOverview(entities, profile);
  }
  const profile = await requireProfile(entities, body.proof);
  if (body.action === 'visibility') {
    if (typeof body.visible !== 'boolean') throw new Error('Ongeldige profielinstelling.');
    await entities.GrowthHubProfile.update(profile.id, { show_on_leaderboard: body.visible });
    return personalOverview(entities, { ...profile, show_on_leaderboard: body.visible });
  }
  if (body.action === 'start' || body.action === 'verify') {
    const quest = await publishedQuest(entities, String(body.slug || ''));
    if (body.action === 'start') return { quest, questions: quest.handler === 'KNOWLEDGE_QUIZ' ? publicQuiz() : [], version: quest.version };
    if (Number(body.version) !== quest.version) throw new Error('De questregels zijn gewijzigd. Open de quest opnieuw.');
    const priorReview = await getQuestReview(entities, profile.wallet, quest.slug);
    if (priorReview?.status === 'APPROVED') {
      const credit = await entities.GrowthHubXP.filter({completion_key:priorReview.review_key},{limit:1});
      if (!credit.items.length) throw new Error('Goedgekeurde review vereist reconciliatie door beheer.');
      return {completed:true,already_completed:true,xp:credit.items[0].delta,overview:await personalOverview(entities,profile)};
    }
    if (priorReview && priorReview.status !== 'APPROVED') return { ...await queueQuestReview(entities,profile,quest,{evidence:priorReview.evidence},[]), overview:await personalOverview(entities,profile) };
    if (chainHandlers.includes(quest.handler) || quest.handler === 'REFERRAL_MINT') {
      const result = await questProof(entities, profile, quest, body.transaction_signature);
      if (result.pending) return { completed: false, ...result };
      const risk = await questRisk(entities, profile.wallet, result.evidence, result.conversion_id);
      if (risk.review || quest.handler === 'REFERRAL_MINT') return { ...await queueQuestReview(entities,profile,quest,result,[...(quest.handler === 'REFERRAL_MINT' ? ['REFERRAL_MANUAL_REVIEW'] : []),...risk.reasons]), overview:await personalOverview(entities,profile) };
      return { ...await creditPilotXP(entities, profile, quest, result.evidence), overview: await personalOverview(entities, profile) };
    }
    const risk = await questRisk(entities, profile.wallet);
    if (risk.review && quest.handler === 'KNOWLEDGE_QUIZ') throw new Error('Rond eerst de bestaande fraudereview af voordat je kennis-XP aanvraagt.');
    if (risk.review && quest.handler === 'PROFILE') return { ...await queueQuestReview(entities,profile,quest,{},risk.reasons), overview:await personalOverview(entities,profile) };
    if (quest.handler === 'KNOWLEDGE_QUIZ') {
      if (profile.last_quiz_at && Date.now() - Date.parse(profile.last_quiz_at) < 30000) throw new Error('Wacht 30 seconden voordat je opnieuw indient.');
      const score = gradeQuiz(body.answers);
      await entities.GrowthHubProfile.update(profile.id, { last_quiz_at: new Date().toISOString() });
      if (score !== 5) return { completed: false, score, total: 5, message: 'Nog niet alle antwoorden kloppen. Bekijk de documentatie en probeer opnieuw.' };
    } else if (quest.handler !== 'PROFILE') throw new Error('Verificatiehandler niet beschikbaar.');
    return { ...await creditPilotXP(entities, profile, quest), overview: await personalOverview(entities, profile) };
  }
  throw new Error('Onbekende deelnemersactie.');
}