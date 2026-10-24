import { fail, text } from './networkLabContext.ts';
import { previewProfileInput } from './networkPreviewProfile.ts';
import { readIdentityRegistry } from './networkIdentityRegistry.ts';
import { refreshTestIdentity } from './networkIdentityRefresh.ts';
import { createDevelopmentProof, consumeDevelopmentProof, proofOrigin } from './networkWalletProof.ts';

async function profileChangeHash(actor, input) {
  let values;
  try { values = previewProfileInput({ ...input, status: 'PUBLISHED' }); }
  catch { fail('Check your display name, bio, profile type and HTTPS links.'); }
  const website = text(input.website || '', 500, false);
  if (website) {
    let url;
    try { url = new URL(website); } catch { fail('Website must be a valid HTTPS address.'); }
    if (url.protocol !== 'https:' || url.username || url.password) fail('Website must use HTTPS without credentials.');
  }
  const mediaId = value => {
    if (typeof value !== 'string' || (value && !/^[a-f0-9]{24}$/.test(value))) fail('Invalid profile image selection.');
    return value;
  };
  const payload = { ...values, website, avatarMediaId: mediaId(input.avatarMediaId === undefined ? actor.avatar_media_id || '' : input.avatarMediaId), bannerMediaId: mediaId(input.bannerMediaId === undefined ? actor.banner_media_id || '' : input.bannerMediaId) };
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(payload)));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function authorizeProfileWrite(db, user, actor, input, req) {
  const registry = await readIdentityRegistry(db);
  const manager = registry.wallets.find(row => row.user_id === actor.public_id);
  if (!manager) fail('Verify your existing wallet and owned handle before editing this profile.', 403);
  if (input.action === 'profileWriteChallenge' && input.wallet !== manager.address) fail('Reconnect this profile’s verified management wallet.', 403);
  const payloadHash = await profileChangeHash(actor, input);
  const identity = await refreshTestIdentity(db, actor.public_id, true);
  if (!identity.ownerVerified) fail('Current handle ownership could not be verified. No profile changes were saved.', 409);
  if (input.action === 'profileWriteChallenge') return await createDevelopmentProof(db, user, actor, { wallet: manager.address }, proofOrigin(req), { payloadHash });
  await consumeDevelopmentProof(db, user, actor, input, proofOrigin(req), { payloadHash, wallet: manager.address });
}