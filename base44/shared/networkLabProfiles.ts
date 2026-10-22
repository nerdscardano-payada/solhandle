import { fail, text, options, testScope } from './networkLabContext.ts';
import { previewProfileInput } from './networkPreviewProfile.ts';
export function labProfile(row) { return { id: row.public_id, name: row.display_name, bio: row.bio || '', kind: row.kind, links: row.social_links || [] }; }
export async function labProfiles(db, user, input, actor) {
  if (input.action === 'bootstrap') {
    const accounts = await db.NetworkAccount.filter({ operator_user_id: user.id, mode: 'DEVELOPMENT', status: 'ACTIVE' }, { limit: 12 });
    const ids = accounts.items.map(row => row.public_id);
    const profiles = ids.length ? await db.NetworkProfile.filter({ public_id: { $in: ids }, preview: false }, { limit: 12 }) : { items: [] };
    return { identities: profiles.items.map(labProfile), testOnly: true };
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
    const row = await db.NetworkProfile.update(actor.id, { ...values, preview: false });
    return { profile: labProfile(row) };
  }
  if (input.action === 'people') {
    const q = typeof input.q === 'string' ? input.q.slice(0, 80).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '';
    const page = await db.NetworkProfile.filter({ preview: false, status: 'PUBLISHED', ...(q ? { display_name: { $regex: q, $options: 'i' } } : {}) }, options(input, 'display_name'));
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
    return { profile: { ...labProfile(row), followers, following, posts, relations: relations.items.map(item => item.kind) } };
  }
  const followers = input.direction === 'followers';
  const relations = await db.NetworkInteraction.filter({ ...testScope, kind: 'FOLLOW', active: true, [followers ? 'target_id' : 'source_id']: target }, options(input));
  const ids = relations.items.map(item => followers ? item.source_id : item.target_id);
  const profiles = ids.length ? await db.NetworkProfile.filter({ preview: false, public_id: { $in: ids } }, { limit: 20 }) : { items: [] };
  return { ...relations, items: profiles.items.map(labProfile) };
}