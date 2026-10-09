import { ArrowRight, UserRound, Wallet } from 'lucide-react';
import { shortenAddress } from '@/lib/solhandle';
import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function AvailableHandlePreview({ handle, wallet }) {
  const { t } = useLanguage();
  return <aside className="dark mt-4 rounded-xl border border-names-accent/25 bg-card p-4 text-foreground" aria-label={t('Preview of your future SolHandle')}>
    <p className="text-xs font-semibold uppercase tracking-wide text-names-accent">{t('Your identity after claiming')}</p>
    <div className="mt-3 flex min-w-0 items-center gap-3">
      <UserRound className="h-8 w-8 shrink-0 text-names-secondary" aria-hidden="true"/>
      <div className="min-w-0"><p className="break-all text-xl font-semibold">@{handle}</p><p className="break-all text-xs text-muted-foreground">solhandle.io/{handle}</p></div>
    </div>
    <div className="mt-4 flex flex-wrap items-center gap-2 text-sm"><span className="break-all font-medium text-names-accent">@{handle}</span><ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true"/><Wallet className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true"/><span className="text-foreground">{wallet ? shortenAddress(wallet) : t('Your Solana wallet')}</span></div>
    <p className="mt-3 text-sm text-foreground">{t('A memorable profile link. Receive SOL with SolHandle Pay.')}</p>
    <p className="mt-2 text-xs text-muted-foreground">{t('Preview only. Your handle becomes yours once the mint is confirmed.')}</p>
  </aside>;
}