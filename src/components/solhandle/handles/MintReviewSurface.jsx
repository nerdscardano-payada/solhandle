import { useLanguage } from '@/components/i18n/LanguageProvider';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function MintReviewSurface({ inline, open, onOpenChange, wallet, handle, children }) {
  const { t } = useLanguage();
  const title = t('Review your Mainnet Beta claim');
  const description = t('Your wallet approves the NFT mint. If no primary name is set, this handle becomes your primary in the same transaction. You can change it later in My Handles.');
  if (inline) return <article className="rounded-2xl border border-border bg-card p-6 text-card-foreground" aria-label={title}>
    <header className="mb-5"><h2 className="font-heading text-xl font-semibold">{title}</h2><p className="mt-2 text-sm text-muted-foreground">{description}</p></header>
    <div className="space-y-5">{!wallet && <button type="button" className="ep-button ep-primary" onClick={() => window.dispatchEvent(new CustomEvent('solhandle:connect-wallet', { detail: { action: 'claim', handle } }))}>{t('Connect Wallet')}</button>}{children}</div>
  </article>;
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[90dvh] overflow-y-auto border-cyan-300/30 bg-slate-950 text-white sm:max-w-md"><DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription className="text-slate-400">{description}</DialogDescription></DialogHeader>{children}</DialogContent></Dialog>;
}