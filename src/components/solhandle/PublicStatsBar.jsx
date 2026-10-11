import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import useDexScreenerMarket from '@/hooks/useDexScreenerMarket';
import '@/components/solhandle/public-stats-bar.css';

const options = { staleTime: 60000, refetchInterval: 60000 };
const number = value => Number.isFinite(value) ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '—';

export default function PublicStatsBar({ tokenMint, settingsLoading }) {
  const { t } = useLanguage();
  const protocol = useQuery({ queryKey: ['public-stats-protocol'], queryFn: async () => (await base44.functions.invoke('getProtocolStats', {})).data, ...options });
  const burns = useQuery({ queryKey: ['public-stats-burns'], queryFn: async () => (await base44.functions.invoke('getBurnDashboard', {})).data.stats, ...options });
  const tokenHolders = useQuery({ queryKey: ['public-stats-token-holders', tokenMint], queryFn: async () => (await base44.functions.invoke('getTokenHolders', { tokenMint })).data, enabled: Boolean(tokenMint), ...options });
  const { market, status } = useDexScreenerMarket(tokenMint);
  const price = market?.priceUsd != null ? Number(market.priceUsd) : null;
  const metrics = [
    { label: 'Holders', value: protocol.isPending ? '…' : number(protocol.data?.uniqueHolders), detail: 'Unique wallets holding a SolHandle, based on the latest index sync.' },
    { label: '$HANDLE holders', value: settingsLoading ? '…' : !tokenMint ? t('Not live yet') : tokenHolders.isPending ? '…' : number(tokenHolders.data?.holders), detail: 'Unique on-chain owners with a positive $HANDLE balance, including pool accounts.' },
    { label: 'Mints', value: protocol.isPending ? '…' : number(protocol.data?.totalMinted), detail: 'Total SolHandles minted, based on the latest index sync.' },
    { label: '$HANDLE price', value: settingsLoading || status === 'loading' ? '…' : !tokenMint ? t('Not live yet') : Number.isFinite(price) ? `$${price.toLocaleString('en-US', { maximumSignificantDigits: 4 })}` : '—', detail: 'USD price from the most liquid trading pair on DexScreener.' },
    { label: 'Burns', value: burns.isPending ? '…' : `${number(burns.data?.totalBurned)}${Number.isFinite(burns.data?.totalBurned) ? ' $HANDLE' : ''}`, detail: 'Total recorded and confirmed $HANDLE burns, not just the last 24 hours.' },
  ];
  return <aside aria-label={t('Protocol stats')} className="dark border-b border-names-accent/10 bg-hero-canvas/60 text-foreground">
    <dl className="public-stats-scroll mx-auto flex max-w-[1320px] items-center justify-between gap-6 overflow-x-auto px-5 py-2.5 text-xs lg:justify-center lg:gap-10 lg:px-9">
      {metrics.map(({ label, value, detail }) => <div key={label} title={t(detail)} className="flex shrink-0 items-center gap-2 whitespace-nowrap">
        <dt className="text-foreground/60">{t(label)}</dt><dd className="font-medium tabular-nums text-names-accent">{value}</dd>
      </div>)}
    </dl>
  </aside>;
}