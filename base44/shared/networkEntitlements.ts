import { fail, testScope } from './networkLabContext.ts';
// Only optional product capabilities. Ownership, trust, moderation, verification
// and ranking are deliberately not entitlement keys. No token balance is trusted.
export const networkEntitlementFeatures = ['PROFILE_CUSTOMIZATION', 'CREATOR_TOOLS', 'ANALYTICS', 'SCHEDULED_POSTS', 'PROJECT_CARDS', 'ADVANCED_PAYMENTS', 'INTEGRATIONS'];
export function evaluateNetworkEntitlements(grants, now = Date.now()) {
  return Object.fromEntries(networkEntitlementFeatures.map(feature => [feature, grants.some(grant => grant.feature === feature && grant.enabled && new Date(grant.expires_at).getTime() > now)]));
}
export async function labEntitlements(db, input, actor) {
  if (input.action === 'setEntitlement') {
    if (!networkEntitlementFeatures.includes(input.feature) || typeof input.enabled !== 'boolean') fail('Invalid optional entitlement.');
    const query = { ...testScope, account_public_id: actor.public_id, feature: input.feature, source: 'OPERATOR_TEST' };
    const rows = await db.NetworkEntitlement.filter(query, { limit: 1 });
    const values = { enabled: input.enabled, expires_at: new Date(Date.now() + 86400000).toISOString() };
    if (rows.items[0]) await db.NetworkEntitlement.updateMany(query, { $set: values });
    else await db.NetworkEntitlement.create({ ...query, ...values });
  }
  const page = await db.NetworkEntitlement.filter({ ...testScope, account_public_id: actor.public_id, source: 'OPERATOR_TEST' }, { limit: 100 });
  return { capabilities: evaluateNetworkEntitlements(page.items), testOnly: true, coreSocialRequiresToken: false };
}