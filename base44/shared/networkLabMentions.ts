import { fail, blocked } from './networkLabContext.ts';
export async function prepareMentions(db, ids, actorId) {
  if (ids === undefined) return [];
  if (!Array.isArray(ids) || ids.length > 10 || ids.some(id => typeof id !== 'string' || !/^[a-f0-9-]{36}$/.test(id))) fail('Choose at most ten account mentions.');
  const unique = [...new Set(ids)].filter(id => id !== actorId);
  if (!unique.length) return [];
  const rows = await db.NetworkProfile.filter({ public_id: { $in: unique }, preview: false, status: 'PUBLISHED' }, { limit: 10 });
  if (rows.items.length !== unique.length) fail('A mentioned test profile is no longer available.');
  for (const row of rows.items) if (await blocked(db, actorId, row.public_id)) fail('Blocked accounts cannot be mentioned.', 403);
  return rows.items.map(row => ({ account_id: row.public_id, label: row.display_name }));
}