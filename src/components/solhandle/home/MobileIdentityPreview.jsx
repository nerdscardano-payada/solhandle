import { AtSign, ArrowUpRight, ContactRound, Send, ArrowDownLeft, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function MobileIdentityPreview() {
  const { t } = useLanguage();
  return <section aria-labelledby="mobile-identity-title" className="mt-10">
    <h2 id="mobile-identity-title" className="text-2xl font-semibold tracking-tight">{t('One @. More ways to use it.')}</h2>
    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t('From a name you own to an identity you use.')}</p>
    <div className="mt-5 overflow-hidden rounded-2xl border border-names-accent/25 bg-gradient-to-br from-names-accent/10 via-card to-names-secondary/10">
      <div className="flex items-center justify-between border-b border-names-accent/15 px-5 py-3 text-xs"><span className="font-medium text-names-accent">SolHandle ID</span><span className="text-muted-foreground">{t('Illustrative example')}</span></div>
      <div className="flex items-center gap-4 px-5 py-5"><span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-names-accent/30 bg-names-accent/10 text-names-accent"><AtSign className="h-8 w-8" aria-hidden="true"/></span><div className="min-w-0"><p className="text-3xl font-bold tracking-tight text-foreground">@ansem</p><p className="mt-1 text-xs text-muted-foreground">{t('One identity. Connected to your wallet.')}</p></div></div>
      <div className="mx-5 mb-5 divide-y divide-border rounded-xl border border-border bg-background/50">
        <div className="flex items-center gap-3 px-3 py-3"><ContactRound className="h-4 w-4 shrink-0 text-names-secondary" aria-hidden="true"/><span className="text-sm">{t('Save the person, not a long address.')}</span></div>
        <div className="flex items-center gap-3 px-3 py-3"><Send className="h-4 w-4 shrink-0 text-names-accent" aria-hidden="true"/><div><p className="text-sm">{t('Send, receive and request by @handle.')}</p><p className="mt-1 text-xs text-muted-foreground">SOL · USDC · USDT · HANDLE</p></div></div>
      </div>
    </div>
    <nav aria-label={t('Explore SolHandle Pay')} className="mt-3 grid grid-cols-3 gap-2">
      {[[Send, '/pay', 'Send'], [ArrowDownLeft, '/receive', 'Receive'], [QrCode, '/receive', 'Request']].map(([Icon, to, label]) => <Link key={label} to={to} className="flex min-w-0 flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card px-2 py-3 text-xs font-medium text-foreground"><Icon className="h-4 w-4 text-names-accent" aria-hidden="true"/>{t(label)}</Link>)}
    </nav>
    <Link to="/contacts" className="mt-2 flex items-center justify-between py-3 text-sm text-names-secondary">{t('Open my contacts')}<ArrowUpRight className="h-4 w-4" aria-hidden="true"/></Link>
  </section>;
}