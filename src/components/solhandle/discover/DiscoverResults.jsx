import useProjectPages from '@/components/solhandle/network/projects/useProjectPages';
import DiscoverCard from '@/components/solhandle/discover/DiscoverCard';
export default function DiscoverResults({ args, featured = false }) {
  const query = useProjectPages({ ...args, featured, limit: featured ? 3 : 18 });
  const items = query.data?.pages.flatMap(page => page.items) || [];
  if (query.isPending) return <p role="status" className="discover-empty">Loading {featured ? 'featured listings' : 'directory'}…</p>;
  if (query.isError) return <div role="alert" className="discover-empty"><p>The directory could not be loaded.</p><button className="ep-button" onClick={() => query.refetch()}>Try again</button></div>;
  if (featured && !items.length) return null;
  return <section className="space-y-5"><h2>{featured ? 'Featured' : 'Explore Solana'}</h2>{featured && <p className="ep-small">Editorial selections, not endorsements or verification.</p>}{items.length ? <div className="ep-project-grid">{items.map(listing => <DiscoverCard key={listing.id} listing={listing}/>)}</div> : <div className="ep-card discover-empty">No matching listings. Change your filters or suggest a listing.</div>}{!featured && query.hasNextPage && <button className="ep-button el-load-more" disabled={query.isFetchingNextPage} onClick={() => query.fetchNextPage()}>{query.isFetchingNextPage ? 'Loading…' : 'Load more'}</button>}</section>;
}