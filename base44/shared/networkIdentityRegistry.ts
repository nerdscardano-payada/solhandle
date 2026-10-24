import { fail } from './networkLabContext.ts';
// Exactly one builder-provisioned DEVELOPMENT record. Never create it during a
// request: that would turn uniqueness into a find-then-create race.
export async function readIdentityRegistry(db) {
  const page = await db.NetworkIdentityRegistry.filter({ scope: 'DEVELOPMENT' }, { limit: 2 });
  if (page.items.length !== 1) fail('Development identity storage needs administrator review.', 503);
  const row = page.items[0];
  if (!Number.isSafeInteger(row.version) || !Array.isArray(row.wallets) || !Array.isArray(row.bindings)) fail('Development identity storage is unavailable.', 503);
  return row;
}
export async function changeIdentityRegistry(db, mutate) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const row = await readIdentityRegistry(db);
    const next = { wallets: structuredClone(row.wallets), bindings: structuredClone(row.bindings) };
    const result = mutate(next);
    if (next.wallets.length > 200 || next.bindings.length > 500) fail('Development identity capacity reached. No existing history was removed.', 409);
    const changed = await db.NetworkIdentityRegistry.updateMany({ id: row.id, version: row.version }, { $set: { ...next, version: row.version + 1 } });
    if (changed.updated === 1) return { ...next, result, version: row.version + 1 };
  }
  fail('Identity changed concurrently. Refresh and try again.', 409);
}
export function currentIdentity(registry, userId) {
  const binding = registry.bindings.find(row => row.user_id === userId && row.status !== 'ENDED');
  const configured = registry.wallets.some(row => row.user_id === userId);
  const verified = Boolean(binding?.status === 'ACTIVE' && Date.parse(binding.valid_until) > Date.now());
  return { identityConfigured: configured, identityStatus: binding?.status || (configured ? 'NO_ACTIVE_HANDLE' : 'TEST_ONLY'), handle: verified ? binding.handle : null, lastHandle: binding?.handle || null, ownerVerified: verified, primaryActive: verified && Boolean(binding.is_primary), paymentsEnabled: verified && Boolean(binding.safe_for_sol), bindingId: binding?.binding_id || null, boundWalletAddress: verified ? binding.wallet_address : null, boundAssetAddress: verified ? binding.asset_id : null, verifiedUntil: binding?.valid_until || null, checkedAt: binding?.checked_at || null };
}