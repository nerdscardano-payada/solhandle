import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { widgetOrigin } from '@/components/solhandle/widgets/widgetOptions';
import { formatRelativeTime } from '@/lib/protocolDisplay';

export default function WidgetActivitySection({ market = false }) {
  const { data = [], isPending, isError, refetch } = useQuery({
    queryKey: ['widget-activity', market ? 'market' : 'claimed'],
    queryFn: async () => {
      if (market) {
        const page = await base44.entities.NativeListing.filter({ status: 'ACTIVE' }, { sort: '-created_date', limit: 3, fields: ['handle', 'price_lamports'] });
        return page.items;
      }
      const response = await base44.functions.invoke('getRecentHandles', { limit: 3 });
      return response.data.handles || [];
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });
  return <section className="mt-5 border-t border-border pt-4">
    <div className="flex items-center justify-between gap-3"><h3 className="font-semibold text-names-accent">{market ? 'Market' : 'Last claimed'}</h3><a href={`${widgetOrigin}${market ? '/market' : '/names?tab=owned'}`} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground">View all →</a></div>
    {isPending ? <p role="status" className="mt-3 text-xs text-muted-foreground">Loading…</p> : isError ? <p role="alert" className="mt-3 text-xs text-names-warning">Could not load activity. <button type="button" onClick={() => refetch()} className="underline">Retry</button></p> : !data.length ? <p className="mt-3 text-xs text-muted-foreground">{market ? 'No active listings yet.' : 'No recently claimed handles yet.'}</p> : <div className="mt-3 space-y-2">{data.map(item => <a key={item.id || item.asset || item.handle} href={`${widgetOrigin}${market ? `/market?handle=${encodeURIComponent(item.handle)}` : `/${encodeURIComponent(item.handle)}`}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2 text-sm hover:border-names-accent/50"><span className="truncate font-semibold">@{item.handle}</span><span className="shrink-0 text-xs text-muted-foreground">{market ? `${(Number(item.price_lamports) / 1000000000).toLocaleString(undefined, { maximumFractionDigits: 9 })} SOL` : item.mintedAt ? formatRelativeTime(item.mintedAt) : 'Claimed'}</span></a>)}</div>}
  </section>;
}