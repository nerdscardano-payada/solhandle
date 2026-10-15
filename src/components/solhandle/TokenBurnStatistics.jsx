import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import useTokenLaunchSettings from '@/hooks/useTokenLaunchSettings';
import useDexScreenerMarket from '@/hooks/useDexScreenerMarket';
import useTokenSupply from '@/hooks/useTokenSupply';

export default function TokenBurnStatistics() {
  const { t } = useLanguage();
  const { tokenMint, loading } = useTokenLaunchSettings();
  const { market, status } = useDexScreenerMarket(tokenMint);
  const { supply, status: supplyStatus } = useTokenSupply(tokenMint);
  const burns = useQuery({ queryKey: ['public-stats-burns'], queryFn: async () => (await base44.functions.invoke('getBurnDashboard', {})).data.stats, staleTime: 60000, refetchInterval: 60000 });
  const holders = useQuery({ queryKey: ['public-stats-token-holders', tokenMint], queryFn: async () => (await base44.functions.invoke('getTokenHolders', { tokenMint })).data, enabled: Boolean(tokenMint), staleTime: 60000, refetchInterval: 60000 });
  const number = value => Number.isFinite(value) ? value.toLocaleString(undefined, { maximumFractionDigits: 3 }) : '—';
  const tokenValue = (value, pending) => loading || (tokenMint && pending) ? '…' : !tokenMint ? t('Not live yet') : number(value);
  const price = market?.priceUsd != null ? Number(market.priceUsd) : null;
  const metrics = [
    ['$HANDLE price · USD', loading || (tokenMint && status === 'loading') ? '…' : !tokenMint ? t('Not live yet') : Number.isFinite(price) ? `$${price.toLocaleString(undefined, { maximumSignificantDigits: 4 })}` : '—'],
    ['$HANDLE holders', tokenValue(holders.data?.holders, holders.isPending)],
    ['Current total supply · $HANDLE', tokenValue(supply, supplyStatus === 'loading')],
    ['Total recorded burn · $HANDLE', burns.isPending ? '…' : number(burns.data?.totalBurned)],
    ['Confirmed burn transactions', burns.isPending ? '…' : number(burns.data?.burnTransactions)],
    ['Verified $HANDLE-paid mints', burns.isPending ? '…' : number(burns.data?.automaticMints)],
  ];
  return <section className="mt-8" aria-label={t('$HANDLE and burns')}>
    <h2 className="text-xl font-semibold text-foreground">{t('$HANDLE and burns')}</h2>
    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{t('Price from DexScreener. Total supply is on-chain supply, not circulating supply. Burns show recorded, confirmed transactions.')}</p>
    <dl className="mt-4 grid grid-cols-2 gap-3 min-[768px]:grid-cols-3">{metrics.map(([label, value]) => <div key={label} className="min-w-0 rounded-xl border border-names-secondary/20 bg-card p-4"><dt className="text-xs leading-relaxed text-muted-foreground">{t(label)}</dt><dd className="mt-2 break-words text-xl font-semibold tabular-nums text-names-secondary">{value}</dd></div>)}</dl>
    {(burns.isError || holders.isError || status === 'unavailable' || supplyStatus === 'unavailable' && tokenMint) && <p role="status" className="mt-3 text-xs text-muted-foreground">{t('Some statistics are temporarily unavailable. Data refreshes automatically.')}</p>}
    <Link to="/growth/burn" className="mt-4 inline-flex min-h-11 items-center text-sm text-names-accent">{t('View burn transactions')} →</Link>
  </section>;
}