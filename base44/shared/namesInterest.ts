const cache = new Map();
export function clearNamesInterest() { cache.clear(); }
async function cached(key, load) {
  const prior = cache.get(key);
  if (prior && prior.expires > Date.now()) return await prior.promise;
  if (cache.size > 100) cache.clear();
  const promise = load(); cache.set(key, { promise, expires: Date.now() + 60000 });
  try { return await promise; } catch (error) { cache.delete(key); throw error; }
}
export async function namesInterest(base44, query = {}, rank = 'searches') {
  return await cached(JSON.stringify({ query, rank }), async () => {
    const since = new Date(Date.now() - 30 * 86400000).toISOString();
    const searchQuery = scope => base44.asServiceRole.entities.SearchAnalytics.aggregate({ query: { ...scope, timestamp: { $gte: since }, session_hash: { $exists: true, $ne: '' } }, groupBy: 'handle', countDistinct: 'session_hash', max: 'timestamp', sort: '-count_distinct_session_hash', limit: 48 });
    const watchQuery = scope => base44.asServiceRole.entities.NameWatch.aggregate({ query: scope, groupBy: 'handle', countDistinct: 'wallet', sort: '-count_distinct_wallet', limit: 48 });
    let searches, watches;
    if (rank === 'watched') {
      watches = await watchQuery(query);
      searches = watches.rows.length ? await searchQuery({ handle: { $in: watches.rows.map(r => r.handle) } }) : { rows: [] };
    } else {
      searches = await searchQuery(query);
      // Scoped detail/list queries must also count watches on names with no searches.
      const scope = query.handle && typeof query.handle !== 'object' || query.handle?.$in ? query : { handle: { $in: searches.rows.map(r => r.handle) } };
      watches = scope.handle?.$in?.length === 0 ? { rows: [] } : await watchQuery(scope);
    }
    const searchByName = new Map(searches.rows.map(r => [r.handle, r]));
    const watchByName = new Map(watches.rows.map(r => [r.handle, r]));
    return { searchByName, watchByName, ranked: (rank === 'watched' ? watches.rows : searches.rows).map(r => r.handle) };
  });
}
export function interestFor(interest, handle) {
  const search = interest.searchByName.get(handle), watch = interest.watchByName.get(handle);
  return { searches: search?.count_distinct_session_hash || 0, watchers: watch?.count_distinct_wallet || 0, lastSearched: search?.max_timestamp || null };
}