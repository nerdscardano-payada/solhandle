import { resolveOnChain } from './solhandleResolver.ts';

export const expiredRankingDate = '1970-01-01T00:00:00.000Z';
export async function checkDiscoverHandle(db, listing, rpcUrl) {
  const now = new Date(), next = hours => new Date(now.getTime() + hours * 3600000).toISOString();
  let patch;
  if (listing.handle !== listing.handle_reviewed_handle || listing.website !== listing.handle_reviewed_website) {
    patch = { handle_check_status: 'INACTIVE', handle_valid_until: expiredRankingDate };
  } else {
    try {
      const result = await resolveOnChain(rpcUrl, listing.handle);
      const matches = result && result.address === listing.handle_owner_wallet && result.assetAddress === listing.handle_verified_asset;
      patch = matches ? { handle_check_status: 'ACTIVE', handle_checked_at: now.toISOString(), handle_check_due_at: next(listing.handle_check_interval_hours || 24) } : { handle_check_status: 'INACTIVE', handle_checked_at: now.toISOString(), handle_valid_until: expiredRankingDate };
    } catch {
      // An unavailable RPC is not evidence of a transfer. Preserve the approved review window.
      patch = { handle_check_status: 'UNCERTAIN', handle_check_due_at: next(1) };
    }
  }
  const latest = await db.NetworkProject.get(listing.id);
  if (latest.updated_date !== listing.updated_date) return { id: listing.id, status: 'SKIPPED_CHANGED' };
  await db.NetworkProject.update(listing.id, patch);
  return { id: listing.id, status: patch.handle_check_status };
}
export async function maintainDiscoverRanking(db, rpcUrl) {
  const now = new Date().toISOString();
  const page = await db.NetworkProject.filter({ handle_valid_until: { $gt: now }, handle_check_status: { $in: ['ACTIVE', 'UNCERTAIN'] }, handle_check_due_at: { $lte: now } }, { sort: 'handle_check_due_at', limit: 30 });
  const results = [];
  for (let i = 0; i < page.items.length; i += 3) {
    results.push(...await Promise.all(page.items.slice(i, i + 3).map(listing => checkDiscoverHandle(db, listing, rpcUrl))));
  }
  return { results, has_more: page.has_more };
}