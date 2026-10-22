import { fail, text, options, testScope, testPost, blocked, notify, recalculateScore, relationRows } from './networkLabContext.ts';
import { labProfile } from './networkLabProfiles.ts';
export async function enrichPosts(db, posts, actor) {
  const ids = posts.map(row => row.id);
  if (!ids.length) return [];
  const [authors, likes, reposts, replies, own] = await Promise.all([
    db.NetworkProfile.filter({ public_id: { $in: posts.map(row => row.author_public_id) }, preview: false }, { limit: 20 }),
    db.NetworkInteraction.aggregate({ query: { ...testScope, post_id: { $in: ids }, kind: 'LIKE', active: true }, groupBy: 'post_id' }),
    db.NetworkInteraction.aggregate({ query: { ...testScope, post_id: { $in: ids }, kind: 'REPOST', active: true }, groupBy: 'post_id' }),
    db.NetworkPost.aggregate({ query: { preview: false, parent_id: { $in: ids }, status: 'PUBLISHED' }, groupBy: 'parent_id' }),
    db.NetworkInteraction.filter({ ...testScope, source_id: actor.public_id, post_id: { $in: ids }, active: true, kind: { $in: ['LIKE', 'REPOST', 'BOOKMARK'] } }, { limit: 60 })
  ]);
  const byAuthor = new Map(authors.items.map(row => [row.public_id, labProfile(row)]));
  const counter = (result, key, id) => result.rows.find(row => row[key] === id)?.count || 0;
  return posts.filter(row => byAuthor.has(row.author_public_id)).map(row => ({ id: row.id, body: row.body, parentId: row.parent_id, date: row.published_at, author: byAuthor.get(row.author_public_id), score: row.discovery_score || 0, likes: counter(likes, 'post_id', row.id), reposts: counter(reposts, 'post_id', row.id), replies: counter(replies, 'parent_id', row.id), states: own.items.filter(item => item.post_id === row.id).map(item => item.kind) }));
}
export async function labPosts(db, input, actor) {
  if (input.action === 'publish') {
    const body = text(input.body, 2000);
    let parent = null;
    if (input.parentId) {
      parent = await testPost(db, input.parentId);
      if (await blocked(db, actor.public_id, parent.author_public_id)) fail('Blocked accounts cannot interact.', 403);
    }
    if (await db.NetworkPost.count({ author_public_id: actor.public_id, preview: false, created_date: { $gte: new Date(Date.now() - 60000).toISOString() } }) >= 8) fail('Development limit: eight posts per minute.', 429);
    const post = await db.NetworkPost.create({ author_public_id: actor.public_id, body, parent_id: parent?.id || '', preview: false, status: 'PUBLISHED', published_at: new Date().toISOString(), discovery_score: 0 });
    if (parent) { await notify(db, parent.author_public_id, actor.public_id, 'REPLY', post.id); await recalculateScore(db, parent.id); }
    return { id: post.id };
  }
  if (input.action === 'deletePost' || input.action === 'editPost') {
    const post = await testPost(db, input.id);
    if (post.author_public_id !== actor.public_id) fail('Only this test author can change the post.', 403);
    await db.NetworkPost.update(post.id, input.action === 'deletePost' ? { status: 'DELETED', body: '' } : { body: text(input.body, 2000) });
    if (post.parent_id) await recalculateScore(db, post.parent_id);
    return { ok: true };
  }
  const relations = await relationRows(db, actor.public_id);
  const excluded = relations.filter(row => row.kind === 'BLOCK' || (row.kind === 'MUTE' && row.source_id === actor.public_id)).map(row => row.source_id === actor.public_id ? row.target_id : row.source_id);
  if (input.action === 'post') {
    const post = await testPost(db, input.id);
    if (excluded.includes(post.author_public_id)) fail('Post hidden by your safety settings.', 403);
    return { post: (await enrichPosts(db, [post], actor))[0] };
  }
  let query = { preview: false, status: 'PUBLISHED', parent_id: '' };
  if (input.mode === 'replies') { const parent = await testPost(db, input.id); if (excluded.includes(parent.author_public_id)) fail('Conversation hidden by your safety settings.', 403); query.parent_id = parent.id; }
  if (input.author) query.author_public_id = input.author;
  if (input.mode === 'following') query.author_public_id = { $in: [actor.public_id, ...relations.filter(row => row.kind === 'FOLLOW' && row.source_id === actor.public_id).map(row => row.target_id)] };
  if (['bookmarks', 'reposts'].includes(input.mode)) {
    const saved = await db.NetworkInteraction.filter({ ...testScope, source_id: actor.public_id, active: true, kind: input.mode === 'bookmarks' ? 'BOOKMARK' : 'REPOST' }, options(input));
    const posts = saved.items.length ? await db.NetworkPost.filter({ ...query, id: { $in: saved.items.map(row => row.post_id) }, author_public_id: { $nin: excluded } }, { limit: 20, sort: '-published_at' }) : { items: [] };
    return { ...saved, items: await enrichPosts(db, posts.items, actor) };
  }
  if (excluded.length) query = { $and: [query, { author_public_id: { $nin: excluded } }] };
  if (input.q) query = { $and: [query, { body: { $regex: text(input.q, 80).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } }] };
  const page = await db.NetworkPost.filter(query, options(input, input.mode === 'discover' ? '-discovery_score' : '-published_at'));
  return { ...page, items: await enrichPosts(db, page.items, actor) };
}