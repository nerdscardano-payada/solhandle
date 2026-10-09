import { verifyGrowthChain } from './growthHubChain.ts';
import { verifyGrowthReferral } from './growthHubReferral.ts';
import { chainHandlers } from './growthHubTransaction.ts';
export async function questProof(entities, profile, quest, signature) {
  if (quest.handler === 'REFERRAL_MINT') return verifyGrowthReferral(entities, profile, quest, signature);
  if (chainHandlers.includes(quest.handler)) return verifyGrowthChain(entities, profile, quest, signature);
  if (quest.handler === 'PROFILE') return { evidence: null };
  throw new Error('Dit bewijs vereist een nieuwe inzending door de deelnemer.');
}