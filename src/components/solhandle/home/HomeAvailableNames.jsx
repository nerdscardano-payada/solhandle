import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import invokeWithRetry from '@/lib/invokeWithRetry';
import HandleCard from '@/components/solhandle/HandleCard';


export default function HomeAvailableNames() {
  const { data, isPending, isError, refetch } = useQuery({ queryKey: ['homepage-recent-searches'], queryFn: async () => (await invokeWithRetry('getRecentHandles', { recentlySearched: true, limit: 3 })).data.handles, staleTime: 30000 });
  const select = handle => { document.getElementById('search-handles')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); window.dispatchEvent(new CustomEvent('solhandle:home-select', { detail: { handle, mint: false } })); };
  return <section className="home-content-section home-discover-section">
    <div className="flex items-center justify-between gap-4"><h2 className="home-section-title">Recently searched handles</h2><Link to="/names" className="text-sm text-names-accent">Explore names →</Link></div>
    <p className="mb-5 text-sm text-foreground/70">Recently searched by the community. Select a name to check its current availability and price.</p>
    {isPending ? <div className="h-36 animate-pulse rounded-xl bg-names-accent/5" role="status">Loading recent searches…</div> : isError ? <p className="text-sm text-foreground/70">Recent searches could not be loaded. <button onClick={() => refetch()} className="text-names-accent underline">Try again</button> or search above.</p> : !data?.length ? <p className="text-sm text-foreground/70">No recent searches yet. Search for your own name above.</p> : <div className="grid grid-cols-3 gap-4">{data.slice(0, 3).map(item => <button key={item.handle} type="button" onClick={() => select(item.handle)} className="home-name-tile home-available-tile text-left">
      <div className="home-tile-artwork"><HandleCard handle={item.handle}/></div>
      <div className="min-w-0"><span className="text-xs text-names-secondary">Recently searched</span><h3 className="mt-2 truncate text-xl font-bold">@{item.handle}</h3><span className="mt-4 block text-sm text-names-accent">Check availability →</span></div>
    </button>)}</div>}
  </section>;
}