import { fail, text, options, testScope, testPost, recalculateScore, relationRows } from './networkLabContext.ts';
import { labProfile } from './networkLabProfiles.ts';
export async function labSafety(db, user, input, actor) {
  if (input.action === 'moderationHistory') {
    if (typeof input.reportId !== 'string' || !/^[a-f0-9]{24}$/.test(input.reportId)) fail('Invalid report ID.');
    const page = await db.NetworkModerationAction.filter({ ...testScope, report_id: input.reportId }, options(input));
    return { ...page, items: page.items.map(row => ({ id: row.id, action: row.action, reason: row.reason, date: row.created_date })) };
  }
  if (input.action === 'report') {
    const post = await testPost(db, input.postId);
    if (!['SPAM', 'SCAM', 'HARASSMENT', 'ILLEGAL', 'OTHER'].includes(input.reason)) fail('Choose a report reason.');
    if (await db.NetworkReport.count({ ...testScope, reporter_id: actor.public_id, post_id: post.id, status: 'OPEN' })) fail('You already have an open report for this post.');
    await db.NetworkReport.create({ ...testScope, reporter_id: actor.public_id, post_id: post.id, reason: input.reason, details: text(input.details || '', 1000, false), status: 'OPEN' });
    return { ok: true };
  }
  if (input.action === 'moderate') {
    const reason = text(input.reason, 1000);
    if (!['HIDE', 'DISMISS', 'RESTORE'].includes(input.decision)) fail('Invalid moderation action.');
    const reports = await db.NetworkReport.filter({ ...testScope, id: input.reportId }, { limit: 1 });
    const report = reports.items[0];
    if (!report) fail('Report not found.', 404);
    const post = await testPost(db, report.post_id, false);
    if (post.status === 'DELETED' && input.decision === 'RESTORE') fail('Deleted content cannot be restored.');
    await db.NetworkModerationAction.create({ ...testScope, report_id: report.id, post_id: post.id, moderator_user_id: user.id, action: input.decision, reason });
    if (input.decision !== 'DISMISS') await db.NetworkPost.update(post.id, { status: input.decision === 'HIDE' ? 'HIDDEN' : 'PUBLISHED' });
    await db.NetworkReport.update(report.id, { status: input.decision === 'DISMISS' ? 'DISMISSED' : 'RESOLVED', resolution: reason });
    if (post.parent_id) await recalculateScore(db, post.parent_id);
    return { ok: true };
  }
  if (input.action === 'reports') {
    const page = await db.NetworkReport.filter(testScope, options(input));
    const ids = page.items.map(row => row.post_id);
    const posts = ids.length ? await db.NetworkPost.filter({ id: { $in: ids }, preview: false }, { limit: 20 }) : { items: [] };
    return { ...page, items: page.items.map(row => ({ id: row.id, postId: row.post_id, reason: row.reason, details: row.details, status: row.status, resolution: row.resolution, body: posts.items.find(post => post.id === row.post_id)?.body || '[removed]' })) };
  }
  if (input.action === 'notificationRead') {
    const rows = await db.NetworkNotification.filter({ ...testScope, id: input.id, recipient_id: actor.public_id }, { limit: 1 });
    if (!rows.items[0]) fail('Notification not available.', 404);
    await db.NetworkNotification.update(rows.items[0].id, { read: true });
    return { ok: true };
  }
  const relations = await relationRows(db, actor.public_id);
  const excluded = relations.filter(row => row.kind === 'BLOCK' || row.kind === 'MUTE').map(row => row.source_id === actor.public_id ? row.target_id : row.source_id);
  const query = { ...testScope, recipient_id: actor.public_id, actor_id: { $nin: excluded } };
  const [page, unread] = await Promise.all([db.NetworkNotification.filter(query, options(input)), db.NetworkNotification.count({ ...query, read: false })]);
  const actors = page.items.length ? await db.NetworkProfile.filter({ public_id: { $in: page.items.map(row => row.actor_id) }, preview: false }, { limit: 20 }) : { items: [] };
  return { ...page, unread, items: page.items.map(row => ({ id: row.id, kind: row.kind, postId: row.post_id, read: row.read, message: row.message || '', actor: actors.items.find(item => item.public_id === row.actor_id) ? labProfile(actors.items.find(item => item.public_id === row.actor_id)) : { id: row.actor_id, name: 'Development account' } })) };
}