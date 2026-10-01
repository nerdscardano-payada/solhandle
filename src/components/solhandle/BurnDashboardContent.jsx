import { useInfiniteQuery } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import BurnDashboardStats from '@/components/solhandle/BurnDashboardStats';
import BurnDashboardHistory from '@/components/solhandle/BurnDashboardHistory';
import BurnMobileDetails from '@/components/solhandle/BurnMobileDetails';
export default function BurnDashboardContent() {
  const burns = useInfiniteQuery({ queryKey: ['burn-dashboard'], initialPageParam: null, queryFn: async ({ pageParam }) => (await base44.functions.invoke('getBurnDashboard', { cursor: pageParam })).data, getNextPageParam: last => last.hasMore ? last.nextCursor : undefined, refetchInterval: 60000 });
  const stats = burns.data?.pages[0]?.stats;
  return <>
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground"><span className="sm:hidden">{stats ? `Updated ${new Date(stats.measuredAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}` : 'Fetching burns…'}</span><span className="hidden sm:inline">{stats ? `Updated ${new Date(stats.measuredAt).toLocaleString('en-GB')} · refreshes every minute` : 'Fetching recorded burns…'}</span><button onClick={() => burns.refetch()} disabled={burns.isFetching} className="inline-flex items-center gap-2 rounded-lg border border-burn-accent/30 px-3 py-2 text-burn-accent disabled:opacity-50"><RefreshCw aria-hidden="true" className={`h-4 w-4 ${burns.isFetching ? 'animate-spin' : ''}`}/>Refresh burns</button></div>
    {burns.isPending && <p role="status" className="mt-8 text-muted-foreground">Loading burn activity…</p>}
    {burns.isError && <p role="alert" className="mt-6 text-destructive">Burn data is temporarily unavailable. Use Refresh burns to try again.</p>}
    {stats && <>
      <BurnDashboardStats stats={stats}/>
      <BurnMobileDetails/>
      <section aria-label="Burn sources" className="mt-6 hidden gap-4 sm:grid md:grid-cols-2"><div className="rounded-2xl border border-burn-accent/20 bg-card p-5"><h2 className="font-semibold text-burn-accent">Automatic mint burns · 50%</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">A successful mint paid in $HANDLE burns half of the token payment. The remainder goes to the treasury. Burn, payment and NFT mint happen in one atomic transaction.</p><Link to="/growth/handle-mint-payments" className="mt-4 inline-block text-sm text-burn-highlight underline">Mint payment status & details →</Link></div><div className="rounded-2xl border border-burn-secondary/20 bg-card p-5"><h2 className="font-semibold text-burn-secondary">Growth & other recorded burns</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Confirmed burns recorded by the protocol team appear here too. Growth-cycle burns are labelled by cycle when linked. Reaching a milestone alone does not execute a burn.</p><p className="mt-4 text-sm text-muted-foreground">Buybacks and other rewards remain separate in Flywheel.</p></div></section>
      <BurnDashboardHistory records={burns.data.pages.flatMap(page => page.items)} hasMore={burns.hasNextPage} loadingMore={burns.isFetchingNextPage} onLoadMore={() => burns.fetchNextPage()}/>
      <p className="mt-5 hidden text-xs leading-relaxed text-muted-foreground sm:block">Totals cover recorded, confirmed burns of the official $HANDLE token, not every burn on Solana. Mint burns appear after confirmation and processing; other burns appear after on-chain verification and registration. Tokens are destroyed, not sent to a burn wallet. Treasury receipts are not burns.</p>
    </>}
  </>;
}