import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import invokeWithRetry from '@/lib/invokeWithRetry';
import { formatRelativeTime } from '@/lib/protocolDisplay';

export default function HomeProof() {
  const recent = useQuery({ queryKey: ['home-recent-mints', 2], queryFn: async () => (await invokeWithRetry('getRecentHandles', { limit: 2 })).data.handles || [], staleTime: 30000 });
  return <section className="home-content-section">
    <h2 className="home-section-title">Real names. Real use.</h2>
    <div className="grid grid-cols-2 gap-12">
      <div><h3 className="mb-4 text-sm font-semibold text-foreground/70">Recently claimed</h3>{recent.isPending ? <p role="status" className="text-sm text-foreground/60">Loading recent claims…</p> : recent.isError ? <p className="text-sm text-foreground/60">Recent claims could not be loaded. <button onClick={() => recent.refetch()} className="text-names-accent underline">Retry</button></p> : !recent.data?.length ? <p className="text-sm text-foreground/60">No recent claims to show yet.</p> : <div className="space-y-3">{recent.data.map(item => <Link key={item.asset || item.handle} to={`/${item.handle}`} className="flex items-center justify-between gap-4 border-b border-names-accent/10 pb-3"><b className="truncate text-xl text-names-accent">@{item.handle}</b><span className="text-xs text-foreground/60">{formatRelativeTime(item.mintedAt)} →</span></Link>)}</div>}</div>
      <div><h3 className="text-sm font-semibold text-names-success">Live integration</h3><p className="mt-3 text-xl font-semibold">MMOPRO · MMO Alpha Terminal</p><p className="mt-3 text-sm leading-relaxed text-foreground/75">Displays SolHandle @names alongside .sol names across its wallet and activity views.</p><div className="mt-4 flex gap-5 text-sm text-names-accent"><a href="https://at.mmocoin.pro" target="_blank" rel="noopener noreferrer">Open terminal ↗</a><a href="https://x.com/MMOProOfficial/status/2105149968764023288" target="_blank" rel="noopener noreferrer">Announcement ↗</a><Link to="/live-integrations">Details →</Link></div><p className="mt-3 text-xs text-foreground/60">Publicly announced September 30, 2026; not an independent protocol audit.</p></div>
    </div>
  </section>;
}