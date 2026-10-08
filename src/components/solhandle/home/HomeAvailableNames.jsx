import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import invokeWithRetry from '@/lib/invokeWithRetry';
import HandleCard from '@/components/solhandle/HandleCard';
import { lamportsToSol } from '@/lib/solhandle';

export default function HomeAvailableNames() {
  const { data, isPending, isError, refetch } = useQuery({ queryKey: ['homepage-available-names'], queryFn: async () => (await invokeWithRetry('getHandleRecommendations', { handle: 'ansem' })).data.recommendations, staleTime: 30000 });
  const select = handle => { document.getElementById('search-handles')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); window.dispatchEvent(new CustomEvent('solhandle:home-select', { detail: { handle, mint: false } })); };
  return <section className="home-content-section home-discover-section">
    <div className="flex items-center justify-between gap-4"><h2 className="home-section-title">Find a name to claim</h2><Link to="/names" className="text-sm text-names-accent">Explore names →</Link></div>
    <p className="mb-5 text-sm text-foreground/70">Available on-chain when checked. Select a name to recheck availability and review its price.</p>
    {isPending ? <div className="h-36 animate-pulse rounded-xl bg-names-accent/5" role="status">Loading available names…</div> : isError ? <p className="text-sm text-foreground/70">Suggestions could not be loaded. <button onClick={() => refetch()} className="text-names-accent underline">Try again</button> or search above.</p> : !data?.length ? <p className="text-sm text-foreground/70">No suggestions right now. Search for your own name above.</p> : <div className="grid grid-cols-3 gap-4">{data.slice(0, 3).map(item => <button key={item.handle} type="button" onClick={() => select(item.handle)} className="home-name-tile home-available-tile text-left">
      <div className="home-tile-artwork"><HandleCard handle={item.handle}/></div>
      <div className="min-w-0"><span className="text-xs text-names-success">Available</span><h3 className="mt-2 truncate text-xl font-bold">@{item.handle}</h3><b className="mt-2 block text-sm text-names-accent">{lamportsToSol(item.priceLamports)} SOL</b><span className="mt-3 block text-xs text-foreground/70">Review name →</span></div>
    </button>)}</div>}
    <p className="mt-4 text-xs text-foreground/60">Name price shown. Network and NFT account costs are additional.</p>
  </section>;
}