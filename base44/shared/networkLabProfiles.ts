import { fail, text, options, testScope } from './networkLabContext.ts';
import { previewProfileInput } from './networkPreviewProfile.ts';
import { approvedMedia, labProfileMedia } from './networkLabMedia.ts';
import { refreshTestIdentity } from './networkIdentityRefresh.ts';
import { readIdentityRegistry } from './networkIdentityRegistry.ts';
export function labProfile(row) { return { id: row.public_id, name: row.display_name, bio: row.bio || '', kind: row.kind, links: row.social_links || [], website: row.website || '', joinedAt: row.created_date, avatarMediaId: row.avatar_media_id || '', bannerMediaId: row.banner_media_id || '', handle: null, ownerVerified: false, primaryActive: false, paymentsEnabled: false }; }
export async function labProfiles(db, user, input, actor) {
  if (input.action === 'bootstrap') {
    const accounts = await db.NetworkAccount.filter({ operator_user_id: user.id, mode: 'DEVELOPMENT', status: 'ACTIVE' }, { limit: 12 });
    const ids = accounts.items.map(row => row.public_id);
    const profiles = ids.length ? await db.NetworkProfile.filter({ public_id: { $in: ids }, preview: false }, { limit: 12 }) : { items: [] };
    const registry = await readIdentityRegistry(db);
    return { identities: profiles.items.map(row => ({ ...labProfile(row), walletAddress: registry.wallets.find(wallet => wallet.user_id === row.public_id)?.address || '' })), testOnly: true };
  }
  if (input.action === 'createIdentity') {
    if (await db.NetworkAccount.count({ operator_user_id: user.id, mode: 'DEVELOPMENT', status: 'ACTIVE' }) >= 12) fail('Maximum twelve development identities per operator.');
    const name = text(input.name, 80);
    const account = await db.NetworkAccount.create({ public_id: crypto.randomUUID(), operator_user_id: user.id, mode: 'DEVELOPMENT', status: 'ACTIVE' });
    const profile = await db.NetworkProfile.create({ account_id: account.id, public_id: account.public_id, display_name: name, bio: '', kind: 'PERSON', social_links: [], preview: false, status: 'PUBLISHED' });
    return { profile: labProfile(profile) };
  }
  if (input.action === 'saveProfile') {
    const values = previewProfileInput({ ...input, status: 'PUBLISHED' });
    const website = text(input.website || '', 500, false);
    if (website) {
      const url = new URL(website);
      if (url.protocol !== 'https:' || url.username || url.password) fail('Website must use HTTPS without credentials.');
    }
    const avatarId = input.avatarMediaId === undefined ? actor.avatar_media_id || '' : input.avatarMediaId;
    const bannerId = input.bannerMediaId === undefined ? actor.banner_media_id || '' : input.bannerMediaId;
    await approvedMedia(db, [avatarId, bannerId].filter(Boolean), actor.public_id);
    const row = await db.NetworkProfile.update(actor.id, { ...values, website, avatar_media_id: avatarId, banner_media_id: bannerId, preview: false });
    return { profile: labProfile(row) };
  }
  if (input.action === 'people') {
    const q = typeof input.q === 'string' ? input.q.slice(0, 80).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '';
    const page = await db.NetworkProfile.filter({ preview: false, status: 'PUBLISHED', ...(q ? { $or: [{ display_name: { $regex: q, $options: 'i' } }, { bio: { $regex: q, $options: 'i' } }] } : {}) }, options(input, 'display_name'));
    return { ...page, items: page.items.map(labProfile) };
  }
  const target = typeof input.target === 'string' ? input.target : actor.public_id;
  const page = await db.NetworkProfile.filter({ preview: false, public_id: target }, { limit: 1 });
  const row = page.items[0];
  if (!row) fail('Test profile not found.', 404);
  if (input.action === 'profile') {
    const [followers, following, posts, relations] = await Promise.all([
      db.NetworkInteraction.count({ ...testScope, target_id: target, kind: 'FOLLOW', active: true }),
      db.NetworkInteraction.count({ ...testScope, source_id: target, kind: 'FOLLOW', active: true }),
      db.NetworkPost.count({ author_public_id: target, preview: false, status: 'PUBLISHED', parent_id: '' }),
      db.NetworkInteraction.filter({ ...testScope, source_id: actor.public_id, target_id: target, post_id: '', active: true }, { limit: 10 })
    ]);
    return { profile: { ...await labProfileMedia(db, labProfile(row)), ...await refreshTestIdentity(db, row.public_id), followers, following, posts, relations: relations.items.map(item => item.kind) } };
  }
  const followers = input.direction === 'followers';
  const relations = await db.NetworkInteraction.filter({ ...testScope, kind: 'FOLLOW', active: true, [followers ? 'target_id' : 'source_id']: target }, options(input));
  const ids = relations.items.map(item => followers ? item.source_id : item.target_id);
  const profiles = ids.length ? await db.NetworkProfile.filter({ preview: false, public_id: { $in: ids } }, { limit: 20 }) : { items: [] };
  return { ...relations, items: profiles.items.map(labProfile) };
}