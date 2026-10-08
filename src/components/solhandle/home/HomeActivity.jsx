import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import invokeWithRetry from '@/lib/invokeWithRetry';
import { formatRelativeTime, shortenWallet } from '@/lib/protocolDisplay';
import HandleCard from '@/components/solhandle/HandleCard';

export default function HomeActivity() {
  const recent = useQuery({ queryKey: ['home-recent-mints', 2], queryFn: async () => (await invokeWithRetry('getRecentHandles', { limit: 2 })).data.handles || [], refetchInterval: 30000 });
  const market = useQuery({ queryKey: ['home-market-listings', 2], queryFn: async () => (await base44.entities.NativeListing.filter({ status: 'ACTIVE' }, { sort: '-created_date', limit: 2, fields: ['handle', 'price_lamports'] })).items, staleTime: 30000 });
  return <div className="home-activity-grid">
    {recent.isPending ? <div className="my-8 h-28 animate-pulse rounded-xl bg-names-accent/5" /> : recent.data?.length > 0 && <section className="home-content-section"><h2 className="home-section-title text-3xl">Recently claimed</h2><div className="home-activity-cards">{recent.data.map((item) => <Link key={item.asset || item.handle} to={`/${item.handle}`} className="home-name-tile"><h3 className="truncate text-3xl font-bold text-names-accent">@{item.handle}</h3><HandleCard handle={item.handle} display={item.display} className="mt-4" /><p className="mt-3 text-sm text-foreground/75">Claimed {formatRelativeTime(item.mintedAt)}</p><p className="mt-2 font-mono text-xs text-foreground/50">{shortenWallet(item.owner)}</p></Link>)}</div></section>}
    {market.isPending ? <div className="my-8 h-28 animate-pulse rounded-xl bg-names-secondary/5" /> : market.data?.length > 0 && <section className="home-content-section"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="home-section-title">Already claimed? It might be for sale.</h2><Link to="/market" className="text-sm text-names-accent">View Marketplace →</Link></div><div className="home-activity-cards">{market.data.map((item) => <Link key={item.id} to={`/market?handle=${encodeURIComponent(item.handle)}`} className="home-name-tile"><h3 className="truncate text-3xl font-bold">@{item.handle}</h3><HandleCard handle={item.handle} className="mt-4" /><b className="mt-3 block text-names-secondary">{Number(item.price_lamports) / 1e9} SOL</b><span className="mt-4 block text-sm text-names-accent">View listing →</span></Link>)}</div></section>}
    {(recent.isError || market.isError) && <p className="text-sm text-foreground/60">Some live activity could not be loaded.</p>}
  </div>;
}