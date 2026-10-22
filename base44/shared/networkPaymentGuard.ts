import { readIdentityRegistry } from './networkIdentityRegistry.ts';
import { normalizeHandle } from './solhandleResolver.ts';
import { fail } from './networkLabContext.ts';
import { networkFlags } from './networkFlags.ts';
export async function guardNetworkPayment(base44, body, resolved) {
  const context = body.networkContext;
  if (!context) return resolved;
  if (!networkFlags.developmentSocial) fail('Network test payments are not available.', 403);
  const user = await base44.auth.me();
  if (user?.role !== 'admin') fail('Administrator test access is required for this Network payment.', 403);
  if (body.contactId || body.requestId || typeof context.accountId !== 'string' || typeof context.bindingId !== 'string') fail('This Network payment context is invalid. Open the profile again.', 409);
  const registry = await readIdentityRegistry(base44.entities);
  const binding = registry.bindings.find(row => row.user_id === context.accountId && row.binding_id === context.bindingId && row.status === 'ACTIVE');
  if (!binding || normalizeHandle(binding.handle) !== normalizeHandle(body.handle) || !resolved?.collectionVerified || resolved.assetAddress !== binding.asset_id || resolved.address !== binding.wallet_address) fail('The Network profile or handle owner changed. No payment was submitted. Open the profile again to select the intended recipient.', 409);
  return resolved;
}