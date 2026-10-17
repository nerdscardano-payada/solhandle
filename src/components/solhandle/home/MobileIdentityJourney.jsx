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
  return <section aria-labelledby="mobile-journey-title" className="mt-5 border-t border-border pt-5">
    <h2 id="mobile-journey-title" className="text-lg font-medium tracking-tight">{t('Mint it. Make it part of your day.')}</h2>
    <ol className="mt-3">
      {steps.map(([title, , to], index) => <li key={title} className="relative flex items-center gap-3">
        {index < steps.length - 1 && <span aria-hidden="true" className="absolute bottom-0 left-3 top-8 w-px bg-border"/>}
        <span className="relative flex h-6 w-6 shrink-0 items-center justify-center bg-hero-canvas font-mono text-[11px] text-muted-foreground" aria-hidden="true">0{index + 1}</span>
        <div className="min-w-0 flex-1">{to.startsWith('#') ? <a href={to} className="flex items-center justify-between gap-3 py-2 text-sm font-medium">{t(title)}<ArrowUpRight className="h-4 w-4 shrink-0 text-names-accent" aria-hidden="true"/></a> : <Link to={to} className="flex items-center justify-between gap-3 py-2 text-sm font-medium">{t(title)}<ArrowUpRight className="h-4 w-4 shrink-0 text-names-accent" aria-hidden="true"/></Link>}</div>
      </li>)}
    </ol>
  </section>;
}