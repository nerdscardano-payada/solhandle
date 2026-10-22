export const testScope = { environment: 'TEST' };
export function fail(message, status = 400) { throw Object.assign(new Error(message), { status }); }
export function text(value, max, required = true) {
  if (typeof value !== 'string' || value.length > max || (required && !value.trim())) fail(`Enter text up to ${max} characters.`);
  return value.trim();
}
export function options(input, sort = '-created_date') {
  if (input.cursor && (typeof input.cursor !== 'string' || input.cursor.length > 4096)) fail('Invalid cursor.');
  return { limit: 20, sort, ...(input.cursor ? { cursor: input.cursor } : {}) };
}
export async function testActor(db, user, actorId) {
  if (typeof actorId !== 'string' || !/^[a-f0-9-]{36}$/.test(actorId)) fail('Choose a development identity.');
  const accounts = await db.NetworkAccount.filter({ public_id: actorId, operator_user_id: user.id, mode: 'DEVELOPMENT', status: 'ACTIVE' }, { limit: 1 });
  if (!accounts.items[0]) fail('This test identity does not belong to this operator.', 403);
  const profiles = await db.NetworkProfile.filter({ public_id: actorId, preview: false }, { limit: 1 });
  if (!profiles.items[0]) fail('Development profile not found.', 404);
  return profiles.items[0];
}
export async function testPost(db, id, published = true) {
  if (typeof id !== 'string' || !/^[a-f0-9]{24}$/.test(id)) fail('Invalid post.');
  const rows = await db.NetworkPost.filter({ id, preview: false, ...(published ? { status: 'PUBLISHED' } : {}) }, { limit: 1 });
  if (!rows.items[0]) fail('Development post not available.', 404);
  return rows.items[0];
}
export async function blocked(db, a, b) {
  return Boolean(await db.NetworkInteraction.count({ ...testScope, kind: 'BLOCK', active: true, $or: [{ source_id: a, target_id: b }, { source_id: b, target_id: a }] }));
}
export async function relationRows(db, actorId) {
  const query = { ...testScope, active: true, $or: [{ source_id: actorId, kind: { $in: ['BLOCK', 'MUTE', 'FOLLOW'] } }, { target_id: actorId, kind: 'BLOCK' }] };
  if (await db.NetworkInteraction.count(query) > 200) fail('Development relationship limit reached; production pagination is still required.', 409);
  return (await db.NetworkInteraction.filter(query, { limit: 200 })).items;
}
export async function notify(db, recipient, actor, kind, postId = '') {
  if (recipient === actor || await blocked(db, recipient, actor)) return;
  await db.NetworkNotification.create({ ...testScope, recipient_id: recipient, actor_id: actor, kind, post_id: postId, read: false });
}
export async function recalculateScore(db, postId) {
  const [likes, reposts, replies] = await Promise.all([
    db.NetworkInteraction.count({ ...testScope, post_id: postId, kind: 'LIKE', active: true }),
    db.NetworkInteraction.count({ ...testScope, post_id: postId, kind: 'REPOST', active: true }),
    db.NetworkPost.count({ parent_id: postId, preview: false, status: 'PUBLISHED' })
  ]);
  await db.NetworkPost.update(postId, { discovery_score: likes + 2 * reposts + 3 * replies });
}