// Public reading and operator previews are independent from member authentication.
// These server-owned gates cannot be enabled by request data or a browser flag.
export const networkFlags = Object.freeze({ publicBrowse: true, operatorPreview: true, developmentSocial: true, walletAuthentication: false, contributions: false, moderation: false, entitlements: false });
export function publicProfile(row) {
  return { id: row.public_id, name: row.display_name, bio: row.bio || '', kind: row.kind, links: row.social_links || [], preview: true, handle: null, ownership: 'NOT_VERIFIED', primaryHandle: false };
}
export function publicPost(row, author) {
  return { id: row.id, body: row.body, parentId: row.parent_id || null, publishedAt: row.published_at, preview: true, author };
}
export function pageResult(page, items) {
  return { items, next_cursor: page.next_cursor || null, has_more: Boolean(page.has_more) };
}
export function validatePublicId(value) {
  return typeof value === 'string' && /^[0-9a-f-]{36}$/.test(value);
}