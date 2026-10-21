import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import MarketplaceRetirementNotice from '@/components/solhandle/retirement/MarketplaceRetirementNotice';
import invokeWithRetry from '@/lib/invokeWithRetry';
import { formatRelativeTime, shortenWallet } from '@/lib/protocolDisplay';
import HandleCard from '@/components/solhandle/HandleCard';

export default function HomeActivity() {
  const recent = useQuery({ queryKey: ['home-recent-mints', 2], queryFn: async () => (await invokeWithRetry('getRecentHandles', { limit: 2 })).data.handles || [], refetchInterval: 30000 });

  return <div className="home-activity-grid">
    {recent.isPending ? <div className="my-8 h-28 animate-pulse rounded-xl bg-names-accent/5" /> : recent.data?.length > 0 && <section className="home-content-section"><h2 className="home-section-title text-3xl">Recently claimed</h2><div className="home-activity-cards">{recent.data.map((item) => <Link key={item.asset || item.handle} to={`/${item.handle}`} className="home-name-tile"><h3 className="truncate text-3xl font-bold text-names-accent">@{item.handle}</h3><HandleCard handle={item.handle} display={item.display} className="mt-4" /><p className="mt-3 text-sm text-foreground/75">Claimed {formatRelativeTime(item.mintedAt)}</p><p className="mt-2 font-mono text-xs text-foreground/50">{shortenWallet(item.owner)}</p></Link>)}</div></section>}
    <MarketplaceRetirementNotice/>
    {recent.isError && <p className="text-sm text-foreground/60">Some live activity could not be loaded.</p>}
  </div>;
}