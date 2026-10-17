import { ArrowUpRight, ShieldCheck, Wallet, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function MobileIdentityTrust() {
  const { t } = useLanguage();
  return <section aria-labelledby="mobile-trust-title" className="mt-9 border-t border-border pt-7">
    <h2 id="mobile-trust-title" className="text-lg font-semibold">{t('Your identity. Your wallet. Your control.')}</h2>
    <ul className="mt-4 space-y-3 text-xs leading-relaxed text-muted-foreground">
      {[[Wallet, 'NFT minted directly to your wallet'], [ShieldCheck, 'Every payment needs your wallet approval.'], [Check, 'One-time payment · No renewals']].map(([Icon, text]) => <li key={text} className="flex items-center gap-3"><Icon className="h-4 w-4 shrink-0 text-names-accent" aria-hidden="true"/>{t(text)}</li>)}
    </ul>
    <div className="mt-7 rounded-xl border border-names-secondary/20 bg-names-secondary/5 p-4">
      <p className="text-xs font-medium text-names-secondary">{t('Already in the ecosystem')}</p>
      <p className="mt-2 text-sm font-semibold">MMOPRO · MMO Alpha Terminal</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{t('Displays SolHandle @handles to make wallets easier to recognize.')}</p>
      <Link to="/live-integrations" className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-names-accent">{t('View live integrations')}<ArrowUpRight className="h-4 w-4" aria-hidden="true"/></Link>
    </div>
  </section>;
}