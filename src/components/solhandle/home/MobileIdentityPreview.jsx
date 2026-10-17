import { AtSign, ArrowUpRight, ContactRound, Send, ArrowDownLeft, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function MobileIdentityPreview() {
  const { t } = useLanguage();
  return <section aria-labelledby="mobile-identity-title" className="mt-7">
    <h2 id="mobile-identity-title" className="text-lg font-medium tracking-tight">{t('One @. More ways to use it.')}</h2>
    <div className="mt-3 overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between px-4 pt-3 text-[11px] text-muted-foreground"><span>SolHandle ID</span><span>{t('Illustrative example')}</span></div>
      <div className="flex items-center gap-3 px-4 py-3"><AtSign className="h-7 w-7 shrink-0 text-names-accent" aria-hidden="true"/><div className="min-w-0"><p className="text-2xl font-semibold tracking-tight text-foreground">@ansem</p><p className="mt-1 text-xs text-muted-foreground">{t('One identity. Connected to your wallet.')}</p></div></div>
      <div className="mx-4 mb-2 border-t border-border text-muted-foreground">
        <div className="flex items-center gap-3 py-2"><ContactRound className="h-4 w-4 shrink-0 text-names-secondary" aria-hidden="true"/><span className="text-sm">{t('Save the person, not a long address.')}</span></div>
        <div className="flex items-center gap-3 py-2"><Send className="h-4 w-4 shrink-0 text-names-accent" aria-hidden="true"/><div><p className="text-sm">{t('Send, receive and request by @handle.')}</p><p className="mt-1 text-xs text-muted-foreground">SOL · USDC · USDT · HANDLE</p></div></div>
      </div>
    </div>
    <nav aria-label={t('Explore SolHandle Pay')} className="mt-3 grid grid-cols-3 gap-2">
      {[[Send, '/pay', 'Send'], [ArrowDownLeft, '/receive', 'Receive'], [QrCode, '/receive', 'Request']].map(([Icon, to, label]) => <Link key={label} to={to} className="flex min-w-0 items-center justify-center gap-2 rounded-lg bg-muted/30 px-2 py-3 text-xs font-medium text-foreground"><Icon className="h-4 w-4 text-names-accent" aria-hidden="true"/>{t(label)}</Link>)}
    </nav>
    <Link to="/contacts" className="mt-1 flex items-center justify-between py-2 text-xs text-muted-foreground">{t('Open my contacts')}<ArrowUpRight className="h-4 w-4" aria-hidden="true"/></Link>
  </section>;
}