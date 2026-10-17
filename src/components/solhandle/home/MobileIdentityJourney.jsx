import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/components/i18n/LanguageProvider';

const steps = [
  ['Mint your @', 'Choose your name and mint it to your wallet.', '#search-handles'],
  ['Make it your identity', 'Set your primary @ so your wallet is easier to recognize.', '/my-handles'],
  ['Save your contacts', 'Keep people close with saved wallet contacts.', '/contacts'],
  ['Send, receive and request', 'Use SOL, USDC, USDT or HANDLE. Always approve in your wallet.', '/pay'],
  ['Take your @ across Solana', 'Be recognizable in apps that support SolHandle.', '/live-integrations'],
];

export default function MobileIdentityJourney() {
  const { t } = useLanguage();
  return <section aria-labelledby="mobile-journey-title" className="mt-8 border-t border-border pt-8">
    <p className="text-xs font-semibold uppercase tracking-widest text-names-secondary">{t('It starts with your @')}</p>
    <h2 id="mobile-journey-title" className="mt-2 text-2xl font-semibold tracking-tight">{t('Mint it. Make it part of your day.')}</h2>
    <ol className="mt-6">
      {steps.map(([title, description, to], index) => <li key={title} className="relative flex gap-4 pb-6 last:pb-0">
        {index < steps.length - 1 && <span aria-hidden="true" className="absolute bottom-0 left-4 top-8 w-px bg-gradient-to-b from-names-accent/30 to-border"/>}
        <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-names-accent/25 bg-card font-mono text-xs text-names-accent" aria-hidden="true">0{index + 1}</span>
        <div className="min-w-0 flex-1">{to.startsWith('#') ? <a href={to} className="flex items-center justify-between gap-3 text-sm font-semibold">{t(title)}<ArrowUpRight className="h-4 w-4 shrink-0 text-names-accent" aria-hidden="true"/></a> : <Link to={to} className="flex items-center justify-between gap-3 text-sm font-semibold">{t(title)}<ArrowUpRight className="h-4 w-4 shrink-0 text-names-accent" aria-hidden="true"/></Link>}<p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t(description)}</p></div>
      </li>)}
    </ol>
  </section>;
}