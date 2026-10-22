export default function NetworkMore({ query }) {
  return query.hasNextPage ? <div className="p-5 text-center"><button disabled={query.isFetchingNextPage} onClick={() => query.fetchNextPage()} className="rounded-full border border-identity-border px-6 py-2 text-sm text-names-accent disabled:opacity-50">{query.isFetchingNextPage ? 'Loading…' : 'Load more'}</button></div> : null;
}