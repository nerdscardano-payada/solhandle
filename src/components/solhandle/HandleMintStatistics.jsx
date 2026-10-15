import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function HandleMintStatistics() {
  const { t } = useLanguage();
  const stats = useQuery({ queryKey: ['public-stats-protocol'], queryFn: async () => (await base44.functions.invoke('getProtocolStats', {})).data, staleTime: 60000, refetchInterval: 60000 });
  const number = value => Number.isFinite(value) ? value.toLocaleString(undefined, { maximumFractionDigits: 3 }) : '—';
  const metrics = [['Total minted', stats.data?.totalMinted], ['Handle holders', stats.data?.uniqueHolders], ['Minted in 24h', stats.data?.minted24h], ['Mint volume · 24h · SOL', stats.data?.mintVolume24hSol], ['Mint volume · 24h · $HANDLE', stats.data?.mintVolume24hHandle], ['Premium handles minted', stats.data?.premiumMinted]];
  return <section className="mt-7" aria-label={t('Handles and mint activity')}>
    <h2 className="text-xl font-semibold text-foreground">{t('Handles and mint activity')}</h2>
    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{t('Based on the latest protocol index sync.')}{stats.data?.lastSync && ` ${new Date(stats.data.lastSync).toLocaleString()}`}</p>
    {stats.isError ? <div role="alert" className="mt-4 text-sm text-muted-foreground">{t('Statistics are temporarily unavailable.')} <button onClick={() => stats.refetch()} className="text-names-accent">{t('Try again')}</button></div> : <dl aria-busy={stats.isPending} className="mt-4 grid grid-cols-2 gap-3 width-min-[768px]:grid-cols-3">{metrics.map(([label, value]) => <div key={label} className="min-w-0 rounded-xl border border-names-accent/20 bg-card p-4"><dt className="text-xs leading-relaxed text-muted-foreground">{t(label)}</dt><dd className="mt-2 break-words text-xl font-semibold tabular-nums text-names-accent">{stats.isPending ? '…' : number(value)}</dd></div>)}</dl>}
  </section>;
}