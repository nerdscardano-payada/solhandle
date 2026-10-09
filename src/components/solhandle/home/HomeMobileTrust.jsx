import { Wallet, Coins, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function HomeMobileTrust() {
  const { t } = useLanguage();
  return <div className="mt-5 grid gap-3 text-xs text-foreground/85 lg:hidden" aria-label="Mint with confidence">
    <span className="flex items-center gap-2"><Wallet className="h-4 w-4 shrink-0 text-names-accent" aria-hidden="true"/>{t('NFT minted directly to your wallet')}</span>
    <span className="flex items-center gap-2"><Coins className="h-4 w-4 shrink-0 text-names-accent" aria-hidden="true"/>{t('One-time payment · No renewals')}</span>
    <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-names-accent" aria-hidden="true"/>{t('You review costs and approve the transaction')}</span>
  </div>;
}