import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Flame, ArrowLeftRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ResponsiveDetails from '@/components/solhandle/ResponsiveDetails';
import TokenContractAddress from '@/components/solhandle/TokenContractAddress';
import useTokenLaunchSettings from '@/hooks/useTokenLaunchSettings';

export default function HomeTokenFlywheel() {
  const { tokenMint } = useTokenLaunchSettings();
  const { t, language } = useLanguage();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['home-token-burn-total'],
    queryFn: async () => {
      const { data } = await base44.functions.invoke('getBurnDashboard', {});
      if (!Number.isFinite(data?.stats?.totalBurned)) throw new Error('Burn total unavailable');
      return data;
    },
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
  const total = data?.stats?.totalBurned;
  return <section className="home-content-section" aria-labelledby="home-token-heading">
    <div className="grid gap-6 rounded-2xl border border-names-secondary/30 bg-card p-5 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:p-7">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-names-secondary">{t('$HANDLE · The SolHandle community token')}</p>
        <h2 id="home-token-heading" className="mt-2 text-2xl font-bold tracking-tight text-foreground lg:text-3xl">{t('Powering the SolHandle flywheel.')}</h2>
        <ResponsiveDetails label={t('How the flywheel connects')}>
          <p className="mt-3 text-sm leading-relaxed text-foreground">{t('Claim and use @handles. Protocol activity contributes to buyback budgets, while confirmed $HANDLE burns permanently reduce token supply.')}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{t('Buyback budgets are not executed purchases. This total includes recorded, confirmed burns, including burns from $HANDLE-paid mints.')}</p>
        </ResponsiveDetails>
        {tokenMint && <div className="mt-4"><p className="mb-2 text-xs font-semibold text-names-accent">{t('Official $HANDLE contract address')}</p><TokenContractAddress tokenMint={tokenMint} className=""/></div>}
        <div className="mt-5 flex flex-col gap-3 lg:flex-row">
          <Link to="/upcoming/token-launch" className="home-primary-button"><ArrowLeftRight className="h-4 w-4" aria-hidden="true"/>{t('Trade $HANDLE')}</Link>
          <Link to="/flywheel" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-names-secondary/40 px-5 py-3 text-sm font-semibold text-names-secondary hover:bg-names-secondary/10">{t('Explore the flywheel')}<ArrowUpRight className="h-4 w-4" aria-hidden="true"/></Link>
        </div>
      </div>
      <div className="min-w-0 rounded-xl border border-burn-accent/30 bg-burn-accent/5 p-5 lg:p-6">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-burn-accent"><Flame className="h-5 w-5" aria-hidden="true"/>{t('Total $HANDLE burned')}</p>
        <p className="mt-3 break-words text-3xl font-bold tracking-tight text-foreground lg:text-4xl" aria-live="polite">{isLoading ? t('Loading…') : isError && total == null ? t('Temporarily unavailable') : new Intl.NumberFormat(language, { maximumFractionDigits: 2 }).format(total)}</p>
        <p className="mt-2 text-sm text-muted-foreground">{t('$HANDLE permanently removed from supply')}</p>
        <Link to="/growth/burn" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-burn-accent">{t('View burn proofs')}<ArrowUpRight className="h-4 w-4" aria-hidden="true"/></Link>
      </div>
    </div>
  </section>;
}