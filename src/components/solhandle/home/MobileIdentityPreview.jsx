import { ArrowUpRight, Send, ArrowDownLeft, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function MobileIdentityPreview() {
  const { t } = useLanguage();
  return <section aria-labelledby="mobile-identity-title" className="mt-7">
    <h2 id="mobile-identity-title" className="text-lg font-medium tracking-tight">{t('One @. More ways to use it.')}</h2>
    <div className="mt-3 overflow-hidden rounded-xl border border-border bg-card">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between gap-3"><p className="text-2xl font-semibold tracking-tight text-names-accent">@ansem</p><span className="text-[11px] text-muted-foreground">{t('Illustrative example')}</span></div>
        <p className="mt-1 text-xs text-muted-foreground">{t('One identity. Connected to your wallet.')}</p>
      </div>
      <nav aria-label={t('Explore SolHandle Pay')} className="grid grid-cols-3 border-t border-border">
        {[[Send, '/pay', 'Send'], [ArrowDownLeft, '/receive', 'Receive'], [QrCode, '/receive', 'Request']].map(([Icon, to, label]) => <Link key={label} to={to} className="flex min-h-11 min-w-0 items-center justify-center gap-2 px-2 py-3 text-xs font-medium text-foreground"><Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true"/>{t(label)}</Link>)}
      </nav>
    </div>
    <Link to="/contacts" className="mt-1 flex items-center justify-between py-2 text-xs text-muted-foreground">{t('Open my contacts')}<ArrowUpRight className="h-4 w-4" aria-hidden="true"/></Link>
  </section>;
}