import { useEffect, useState } from 'react';
import useProjectPages from '@/components/solhandle/network/projects/useProjectPages';
import DiscoverCard from '@/components/solhandle/discover/DiscoverCard';
export default function DiscoverResults({ args, featured = false }) {
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width:767px)').matches);
  const [pageIndex, setPageIndex] = useState(0);
  const filters = JSON.stringify(args);
  useEffect(() => {
    const media = window.matchMedia('(max-width:767px)');
    const update = () => setMobile(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => { setPageIndex(0); }, [filters, mobile]);
  const query = useProjectPages({ ...args, featured, limit: featured ? 3 : mobile ? 4 : 18 });
  const pages = query.data?.pages || [];
  const items = mobile ? pages[pageIndex]?.items || [] : pages.flatMap(page => page.items);
  const hasNext = pageIndex < pages.length - 1 || query.hasNextPage;
  const nextPage = async () => {
    if (pageIndex === pages.length - 1) {
      const result = await query.fetchNextPage();
      if (!result.data?.pages[pageIndex + 1]) return;
    }
    setPageIndex(index => index + 1);
  };
  if (query.isPending) return <p role="status" className="discover-empty">Loading {featured ? 'featured listings' : 'directory'}…</p>;
  if (query.isError) return <div role="alert" className="discover-empty"><p>The directory could not be loaded.</p><button className="ep-button" onClick={() => query.refetch()}>Try again</button></div>;
  if (featured && !items.length) return null;
  return <section className="space-y-5"><h2>{featured ? 'Featured' : 'Explore Solana'}</h2>{featured && <p className="ep-small">Editorial selections, not endorsements or verification.</p>}{items.length ? <div className="ep-project-grid">{items.map(listing => <DiscoverCard key={listing.id} listing={listing}/>)}</div> : <div className="ep-card discover-empty">No matching listings. Change your filters or suggest a listing.</div>}{!featured && mobile && (pageIndex > 0 || hasNext) && <nav className="discover-actions" aria-label="Listing pages"><button className="ep-button" disabled={pageIndex === 0 || query.isFetchingNextPage} onClick={() => setPageIndex(index => index - 1)}>Previous</button><span className="ep-small" aria-live="polite">Page {pageIndex + 1}</span><button className="ep-button" disabled={!hasNext || query.isFetchingNextPage} onClick={nextPage}>{query.isFetchingNextPage ? 'Loading…' : 'Next'}</button></nav>}{!featured && !mobile && query.hasNextPage && <button className="ep-button el-load-more" disabled={query.isFetchingNextPage} onClick={() => query.fetchNextPage()}>{query.isFetchingNextPage ? 'Loading…' : 'Load more'}</button>}</section>;
}