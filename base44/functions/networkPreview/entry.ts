import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { networkFlags } from '../../shared/networkFlags.ts';
import { previewProfileInput } from '../../shared/networkPreviewProfile.ts';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Operator access required' }, { status: 403 });
    if (!networkFlags.operatorPreview) return Response.json({ error: 'Operator publishing is paused' }, { status: 403 });
    const input = await req.json();
    const db = base44.entities;
    const accounts = await db.NetworkAccount.filter({ operator_user_id: user.id, mode: 'OPERATOR_PREVIEW', status: 'ACTIVE' }, { limit: 1 });
    let account = accounts.items[0];
    const rows = account ? await db.NetworkProfile.filter({ account_id: account.id, preview: true }, { limit: 1 }) : { items: [] };
    let profile = rows.items[0];
    if (input.action === 'load') {
      const posts = profile ? await db.NetworkPost.filter({ author_public_id: profile.public_id, preview: true, status: { $ne: 'DELETED' } }, { limit: 20, sort: '-created_date', ...(input.cursor ? { cursor: input.cursor } : {}) }) : { items: [], has_more: false, next_cursor: null };
      return Response.json({ profile: profile || null, posts: { items: posts.items.map(row => ({ id: row.id, body: row.body, status: row.status, parent_id: row.parent_id, published_at: row.published_at })), has_more: posts.has_more, next_cursor: posts.next_cursor || null } });
    }
    if (input.action === 'saveProfile') {
      const values = previewProfileInput(input);
      if (!account) account = await db.NetworkAccount.create({ public_id: crypto.randomUUID(), operator_user_id: user.id, mode: 'OPERATOR_PREVIEW', status: 'ACTIVE' });
      profile = profile ? await db.NetworkProfile.update(profile.id, values) : await db.NetworkProfile.create({ ...values, account_id: account.id, public_id: account.public_id });
      return Response.json({ profile });
    }
    if (!profile) return Response.json({ error: 'Create your explicit operator preview profile first' }, { status: 400 });
    if (input.action === 'publish') {
      const body = String(input.body || '').trim();
      if (!body || body.length > 2000) return Response.json({ error: 'Post must contain 1–2000 characters' }, { status: 400 });
      if (profile.status !== 'PUBLISHED') return Response.json({ error: 'Publish your preview profile before posting' }, { status: 400 });
      let parentId = '';
      if (input.parent_id) {
        if (typeof input.parent_id !== 'string' || !/^[a-f0-9]{24}$/.test(input.parent_id)) return Response.json({ error: 'Invalid parent post' }, { status: 400 });
        const parents = await db.NetworkPost.filter({ id: input.parent_id, status: 'PUBLISHED', preview: true }, { limit: 1 });
        if (!parents.items[0]) return Response.json({ error: 'Parent post is not published' }, { status: 400 });
        parentId = input.parent_id;
      }
      const post = await db.NetworkPost.create({ author_public_id: profile.public_id, body, parent_id: parentId, status: 'PUBLISHED', preview: true, published_at: new Date().toISOString() });
      return Response.json({ id: post.id });
    }
    if (input.action === 'remove') {
      if (typeof input.id !== 'string' || !/^[a-f0-9]{24}$/.test(input.id)) return Response.json({ error: 'Invalid post' }, { status: 400 });
      const posts = await db.NetworkPost.filter({ id: input.id, author_public_id: profile.public_id, preview: true }, { limit: 1 });
      if (!posts.items[0]) return Response.json({ error: 'Post not found' }, { status: 404 });
      await db.NetworkPost.update(posts.items[0].id, { status: 'DELETED', body: '' });
      return Response.json({ ok: true });
    }
    return Response.json({ error: 'Unknown operator action; member actions are not enabled' }, { status: 400 });
  } catch (error) {
    if (error.status === 401 || error.response?.status === 401) return Response.json({ error: 'Operator login required' }, { status: 401 });
    return Response.json({ error: error.message || 'Operator publishing failed' }, { status: 400 });
  }
}