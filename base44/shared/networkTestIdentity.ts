import { secrets } from 'base44:runtime';
import { normalizeHandle, resolveOnChain, reverseOnChain } from './solhandleResolver.ts';
import { fail, testScope } from './networkLabContext.ts';
import { createDevelopmentProof, consumeDevelopmentProof, proofOrigin } from './networkWalletProof.ts';
import { readIdentityRegistry, changeIdentityRegistry, currentIdentity } from './networkIdentityRegistry.ts';
import { refreshTestIdentity } from './networkIdentityRefresh.ts';
export async function testIdentityOperation(db, user, actor, input, req) {
  if (input.action === 'identityChallenge') return await createDevelopmentProof(db, user, actor, input, proofOrigin(req));
  if (input.action === 'identityRefresh') return { identity: await refreshTestIdentity(db, actor.public_id, true) };
  if (input.action === 'identityRecipient') {
    if (typeof input.target !== 'string' || !/^[a-f0-9-]{36}$/.test(input.target)) fail('Choose a Network account.');
    const profile = await db.NetworkProfile.filter({ public_id: input.target, preview: false, status: 'PUBLISHED' }, { limit: 1 });
    if (!profile.items[0]) fail('Network profile is not available.', 404);
    const identity = await refreshTestIdentity(db, input.target, true);
    if (!identity.ownerVerified || !identity.paymentsEnabled || (input.bindingId && input.bindingId !== identity.bindingId)) fail('This profile no longer has the same verified payment identity. No recipient was selected.', 409);
    const registry = await readIdentityRegistry(db);
    const binding = registry.bindings.find(row => row.binding_id === identity.bindingId && row.status === 'ACTIVE');
    if (!binding) fail('The payment identity changed. Refresh the profile.', 409);
    return { recipient: { accountId: input.target, bindingId: binding.binding_id, handle: binding.handle, address: binding.wallet_address, name: profile.items[0].display_name } };
  }
  const challenge = await consumeDevelopmentProof(db, user, actor, input, proofOrigin(req));
  const rpcUrl = secrets.get('SOLANA_RPC_URL');
  let primary, resolved;
  try { primary = await reverseOnChain(rpcUrl, challenge.wallet); const handle = challenge.handle || normalizeHandle(primary?.primaryHandle || ''); if (!handle) fail('This wallet has no valid Primary Handle. Choose another owned handle.'); resolved = await resolveOnChain(rpcUrl, handle); }
  catch (error) { if (error.status) throw error; console.warn('Network binding RPC unavailable', error.message); fail('We could not verify current SolHandle ownership. Please try again.', 503); }
  if (!resolved?.collectionVerified || resolved.address !== challenge.wallet) fail('The signed wallet does not currently own this official SolHandle.', 403);
  const now = new Date().toISOString();
  const registry = await changeIdentityRegistry(db, next => {
    const wallet = next.wallets.find(row => row.address === challenge.wallet);
    if (wallet && wallet.user_id !== actor.public_id) fail('This wallet already controls another development Network account. Return to that account.', 409);
    if (next.wallets.some(row => row.user_id === actor.public_id && row.address !== challenge.wallet)) fail('This account already has a verified wallet. Changing management wallets needs a separate recovery flow.', 409);
    if (!wallet) next.wallets.push({ user_id: actor.public_id, address: challenge.wallet, verified_at: now });
    const existing = next.bindings.find(row => row.user_id === actor.public_id && row.asset_id === resolved.assetAddress && row.status !== 'ENDED');
    const displaced = [];
    for (const row of next.bindings) if (row.status !== 'ENDED' && row !== existing && (row.user_id === actor.public_id || row.asset_id === resolved.assetAddress)) { row.status = 'ENDED'; row.ended_at = now; row.valid_until = now; if (row.user_id !== actor.public_id) displaced.push(row.user_id); }
    const values = { user_id: actor.public_id, wallet_address: challenge.wallet, asset_id: resolved.assetAddress, handle: resolved.handle, is_primary: primary?.assetAddress === resolved.assetAddress, safe_for_sol: Boolean(resolved.safeForNativeSol), status: 'ACTIVE', checked_at: now, valid_until: new Date(Date.now() + 60000).toISOString() };
    if (existing) Object.assign(existing, values); else next.bindings.push({ ...values, binding_id: crypto.randomUUID(), started_at: now });
    return displaced;
  });
  for (const id of registry.result) await db.NetworkNotification.create({ ...testScope, recipient_id: id, actor_id: id, kind: 'OWNERSHIP_CHANGE', post_id: '', read: false, message: 'This handle now belongs to another verified owner. Your Network account, followers and social history were not transferred.' });
  return { identity: currentIdentity(registry, actor.public_id) };
}