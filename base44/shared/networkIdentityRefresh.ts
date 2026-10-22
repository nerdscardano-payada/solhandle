import { secrets } from 'base44:runtime';
import { resolveOnChain, reverseOnChain } from './solhandleResolver.ts';
import { readIdentityRegistry, changeIdentityRegistry, currentIdentity } from './networkIdentityRegistry.ts';
import { fail, testScope } from './networkLabContext.ts';
export async function refreshTestIdentity(db, userId, force = false) {
  let registry = await readIdentityRegistry(db);
  const binding = registry.bindings.find(row => row.user_id === userId && row.status !== 'ENDED');
  if (!binding || (!force && binding.status === 'ACTIVE' && Date.parse(binding.valid_until) > Date.now())) return currentIdentity(registry, userId);
  let resolved, primary;
  try { resolved = await resolveOnChain(secrets.get('SOLANA_RPC_URL'), binding.handle); if (resolved?.address === binding.wallet_address) primary = await reverseOnChain(secrets.get('SOLANA_RPC_URL'), binding.wallet_address); }
  catch (error) {
    console.warn('Network ownership refresh unavailable', error.message);
    registry = await changeIdentityRegistry(db, next => { const row = next.bindings.find(item => item.binding_id === binding.binding_id && item.status !== 'ENDED'); if (row) { row.status = 'UNCERTAIN'; row.valid_until = new Date(0).toISOString(); } });
    return currentIdentity(registry, userId);
  }
  const valid = resolved?.address === binding.wallet_address && resolved.assetAddress === binding.asset_id;
  const now = new Date().toISOString();
  registry = await changeIdentityRegistry(db, next => {
    const row = next.bindings.find(item => item.binding_id === binding.binding_id && item.status !== 'ENDED');
    if (!row) return false;
    if (!valid) { row.status = 'ENDED'; row.ended_at = now; row.valid_until = now; return true; }
    row.status = 'ACTIVE'; row.checked_at = now; row.valid_until = new Date(Date.now() + 60000).toISOString(); row.is_primary = primary?.assetAddress === row.asset_id; row.safe_for_sol = Boolean(resolved.safeForNativeSol);
    return false;
  });
  if (registry.result) await db.NetworkNotification.create({ ...testScope, recipient_id: userId, actor_id: userId, kind: 'OWNERSHIP_CHANGE', post_id: '', read: false, message: 'Your handle binding ended because current on-chain ownership changed. Your Network account and social history remain yours.' });
  return currentIdentity(registry, userId);
}
export async function requireTestIdentityForWrite(db, actor) {
  const identity = await refreshTestIdentity(db, actor.public_id, true);
  if (identity.identityConfigured && !identity.ownerVerified) fail('Your handle ownership is not currently verified. Refresh your identity or select an owned handle before posting or interacting.', 409);
  return identity;
}