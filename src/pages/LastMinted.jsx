import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import Header from '@/components/solhandle/Header';
import RecentHandleActivityCard from '@/components/solhandle/RecentHandleActivityCard';
import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function LastMinted() {
  const { t, formatRelativeTime } = useLanguage();
  const recent = useQuery({ queryKey: ['last-minted'], queryFn: async () => (await base44.functions.invoke('getRecentHandles', { limit: 12 })).data.handles || [], refetchInterval: 30000 });
  return <main className="dark min-h-screen bg-hero-canvas text-foreground">
    <Header />
    <section className="mx-auto max-w-5xl px-5 py-7 width-min-[768px]:py-12">
      <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-3xl font-semibold">{t('Last minted')}</h1><button type="button" disabled={recent.isFetching} onClick={() => recent.refetch()} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-names-accent/25 px-3 text-sm text-names-accent disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${recent.isFetching ? 'animate-spin' : ''}`} aria-hidden="true" />{t('Refresh')}</button></div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t('The 12 most recently minted handles, based on the latest index sync. Refreshes every 30 seconds.')}</p>
      {recent.isPending && <p role="status" className="mt-7 text-muted-foreground">{t('Loading recently minted handles…')}</p>}
      {recent.isError && <p role="alert" className="mt-7 text-muted-foreground">{t('Mint activity is temporarily unavailable. Please try Refresh.')}</p>}
      {recent.isSuccess && !recent.data.length && <p className="mt-7 text-muted-foreground">{t('No minted handles yet.')}</p>}
      {recent.data?.length > 0 && <div className="mt-6 grid grid-cols-2 gap-3 width-min-[768px]:grid-cols-3">{recent.data.map(item => <div key={item.asset || item.handle} className="min-w-0"><RecentHandleActivityCard item={item} /><p className="mt-2 text-xs text-muted-foreground">{t('Minted')} {item.mintedAt ? formatRelativeTime(item.mintedAt) : '—'}</p></div>)}</div>}
      <Link to="/names?tab=owned" className="mt-6 inline-flex min-h-11 items-center text-sm text-names-accent">{t('View all handles')} →</Link>
    </section>
  </main>;
}