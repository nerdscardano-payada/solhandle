import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { networkFlags, publicProfile, publicPost, pageResult, validatePublicId } from '../../shared/networkFlags.ts';

export default async function(req) {
  try {
    if (req.method !== 'POST') return Response.json({ error: 'POST required' }, { status: 405 });
    const input = await req.json();
    const action = input.action || 'feed';
    if (!networkFlags.publicBrowse) return Response.json({ error: 'Public browsing is paused' }, { status: 503 });
    if (action === 'capabilities') return Response.json({ flags: networkFlags, message: 'Public reading and explicitly labelled operator previews only. Member authentication is not enabled.' });
    if (!['feed', 'profiles', 'profile', 'post', 'replies'].includes(action)) return Response.json({ error: 'Unknown public operation' }, { status: 400 });
    const q = String(input.q || '').trim();
    if (q.length > 80 || (input.cursor && (typeof input.cursor !== 'string' || input.cursor.length > 4096))) return Response.json({ error: 'Invalid search or cursor' }, { status: 400 });
    // Deliberately public read operation. Service access is limited to explicit published
    // public projections; private account, creator/session metadata never leaves this endpoint.
    const db = createClientFromRequest(req).asServiceRole.entities;
    const published = { status: 'PUBLISHED', preview: true };
    const options = { limit: 20, sort: '-published_at', ...(input.cursor ? { cursor: input.cursor } : {}) };
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const profilesByIds = async ids => {
      if (!ids.length) return new Map();
      const page = await db.NetworkProfile.filter({ ...published, public_id: { $in: [...new Set(ids)] } }, { limit: 20 });
      return new Map(page.items.map(row => [row.public_id, publicProfile(row)]));
    };
    const visiblePost = async id => {
      if (typeof id !== 'string' || !/^[a-f0-9]{24}$/.test(id)) return null;
      const rows = await db.NetworkPost.filter({ ...published, id }, { limit: 1 });
      const row = rows.items[0];
      if (!row) return null;
      const authors = await profilesByIds([row.author_public_id]);
      const author = authors.get(row.author_public_id);
      return author ? publicPost(row, author) : null;
    };
    if (action === 'profiles') {
      const query = { ...published, ...(q ? { $or: [{ display_name: { $regex: escaped, $options: 'i' } }, { bio: { $regex: escaped, $options: 'i' } }] } : {}) };
      const page = await db.NetworkProfile.filter(query, { ...options, sort: 'display_name' });
      return Response.json(pageResult(page, page.items.map(publicProfile)));
    }
    if (action === 'profile') {
      if (!validatePublicId(input.id)) return Response.json({ profile: null });
      const rows = await db.NetworkProfile.filter({ ...published, public_id: input.id }, { limit: 1 });
      const row = rows.items[0];
      if (!row) return Response.json({ profile: null });
      const [posts, replies] = await Promise.all([
        db.NetworkPost.count({ ...published, author_public_id: row.public_id, parent_id: '' }),
        db.NetworkPost.count({ ...published, author_public_id: row.public_id, parent_id: { $ne: '' } })
      ]);
      return Response.json({ profile: { ...publicProfile(row), posts, replies } });
    }
    if (action === 'post') return Response.json({ post: await visiblePost(input.id) });
    let query = { ...published };
    if (action === 'replies') {
      if (!await visiblePost(input.id)) return Response.json({ items: [], has_more: false, next_cursor: null });
      query.parent_id = input.id;
    } else {
      query.parent_id = input.kind === 'replies' ? { $ne: '' } : '';
      if (input.author) {
        if (!validatePublicId(input.author)) return Response.json({ error: 'Invalid account' }, { status: 400 });
        query.author_public_id = input.author;
      }
      if (q) query.body = { $regex: escaped, $options: 'i' };
    }
    const page = await db.NetworkPost.filter(query, options);
    const authors = await profilesByIds(page.items.map(row => row.author_public_id));
    return Response.json(pageResult(page, page.items.filter(row => authors.has(row.author_public_id)).map(row => publicPost(row, authors.get(row.author_public_id)))));
  } catch (error) {
    console.error('Network public read failed', error.message);
    return Response.json({ error: 'Network content could not be loaded' }, { status: 500 });
  }
}