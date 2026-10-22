import { fail, testScope, testPost, blocked, notify, recalculateScore, relationRows } from './networkLabContext.ts';
export async function labInteract(db, input, actor) {
  const kind = input.kind;
  if (!['LIKE', 'REPOST', 'BOOKMARK', 'FOLLOW', 'BLOCK', 'MUTE'].includes(kind) || typeof input.active !== 'boolean') fail('Choose a valid interaction and explicit state.');
  let targetId = input.target;
  let postId = '';
  if (['LIKE', 'REPOST', 'BOOKMARK'].includes(kind)) {
    const post = await testPost(db, input.postId);
    targetId = post.author_public_id;
    postId = post.id;
  } else {
    const target = await db.NetworkProfile.filter({ public_id: targetId, preview: false, status: 'PUBLISHED' }, { limit: 1 });
    if (!target.items[0]) fail('Development profile not available.', 404);
    if (targetId === actor.public_id) fail('Choose another development account.');
  }
  if (!['BLOCK', 'MUTE', 'BOOKMARK'].includes(kind) && input.active && await blocked(db, actor.public_id, targetId)) fail('Blocked accounts cannot interact.', 403);
  if (['BLOCK', 'MUTE', 'FOLLOW'].includes(kind) && input.active) {
    const relations = await relationRows(db, actor.public_id);
    if (relations.length >= 190) fail('Development relationship limit reached.', 409);
  }
  const query = { ...testScope, source_id: actor.public_id, target_id: targetId, post_id: postId, kind };
  const existing = await db.NetworkInteraction.filter(query, { limit: 1 });
  const wasActive = existing.items[0]?.active;
  if (existing.items[0]) await db.NetworkInteraction.updateMany(query, { $set: { active: input.active } });
  else await db.NetworkInteraction.create({ ...query, active: input.active });
  if (kind === 'BLOCK' && input.active) await db.NetworkInteraction.updateMany({ ...testScope, kind: 'FOLLOW', active: true, $or: [{ source_id: actor.public_id, target_id: targetId }, { source_id: targetId, target_id: actor.public_id }] }, { $set: { active: false } });
  if (input.active && !wasActive && ['LIKE', 'REPOST', 'FOLLOW'].includes(kind)) await notify(db, targetId, actor.public_id, kind, postId);
  if (postId && ['LIKE', 'REPOST'].includes(kind)) await recalculateScore(db, postId);
  return { ok: true, active: input.active };
}