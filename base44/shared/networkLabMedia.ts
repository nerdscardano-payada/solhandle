import { fail, testScope, options } from './networkLabContext.ts';
export function mediaProjection(row) { return { id: row.id, fileUri: row.file_uri, width: row.width, height: row.height, status: row.status }; }
export async function approvedMedia(db, ids, owner) {
  if (!Array.isArray(ids) || ids.length > 4 || ids.some(id => typeof id !== 'string' || !/^[a-f0-9]{24}$/.test(id))) fail('Invalid image selection.');
  if (!ids.length) return [];
  const unique = [...new Set(ids)];
  const page = await db.NetworkMedia.filter({ ...testScope, id: { $in: unique }, status: 'APPROVED', ...(owner ? { owner_public_id: owner } : {}) }, { limit: 4 });
  if (page.items.length !== unique.length) fail('Images need approval and must belong to the active test identity.');
  return page.items;
}
export async function labMedia(db, input, actor) {
  if (input.action === 'registerMedia') {
    if (typeof input.fileUri !== 'string' || !input.fileUri || input.fileUri.length > 2048 || /^https?:/i.test(input.fileUri)) fail('Upload an image to private storage first.');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(input.mimeType)) fail('Only raster JPEG, PNG and WebP images are supported.');
    if (![input.byteSize, input.width, input.height].every(Number.isInteger) || input.byteSize < 1 || input.byteSize > 10485760 || input.width < 1 || input.height < 1 || input.width > 2048 || input.height > 2048) fail('Invalid image limits.');
    if (await db.NetworkMedia.count({ ...testScope, owner_public_id: actor.public_id, created_date: { $gte: new Date(Date.now() - 60000).toISOString() } }) >= 8) fail('Maximum eight test images per minute.', 429);
    const row = await db.NetworkMedia.create({ ...testScope, owner_public_id: actor.public_id, file_uri: input.fileUri, mime_type: input.mimeType, byte_size: input.byteSize, width: input.width, height: input.height, status: 'PENDING' });
    return { media: mediaProjection(row) };
  }
  if (typeof input.id !== 'string' || !/^[a-f0-9]{24}$/.test(input.id)) fail('Invalid test image.');
  const page = await db.NetworkMedia.filter({ ...testScope, id: input.id, owner_public_id: actor.public_id }, { limit: 1 });
  if (!page.items[0]) fail('This test image does not belong to the active identity.', 403);
  if (!['APPROVED', 'REJECTED'].includes(input.status)) fail('Choose approve or reject.');
  return { media: mediaProjection(await db.NetworkMedia.update(page.items[0].id, { status: input.status })) };
}
export async function labProfileMedia(db, profile) {
  const ids = [profile.avatarMediaId, profile.bannerMediaId].filter(Boolean);
  if (!ids.length) return { ...profile, avatar: null, banner: null };
  const rows = await db.NetworkMedia.filter({ ...testScope, id: { $in: ids }, status: 'APPROVED' }, { limit: 2 });
  return { ...profile, avatar: rows.items.find(row => row.id === profile.avatarMediaId) ? mediaProjection(rows.items.find(row => row.id === profile.avatarMediaId)) : null, banner: rows.items.find(row => row.id === profile.bannerMediaId) ? mediaProjection(rows.items.find(row => row.id === profile.bannerMediaId)) : null };
}