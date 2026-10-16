import { useLanguage } from '@/components/i18n/LanguageProvider';
import HandleSearch from '@/components/solhandle/HandleSearch';
import MobileMintPurpose from '@/components/solhandle/home/MobileMintPurpose';

export default function MobileMintHome({ wallet }) {
  const { t } = useLanguage();
  return <section className="mx-auto max-w-xl px-5 py-8 text-foreground">
    <p className="text-sm font-medium text-names-accent">SolHandle · Your @ on Solana</p>
    <h1 className="mt-3 text-3xl font-semibold">{t('Mint a Handle')}</h1>
    <p className="mt-2 text-sm text-muted-foreground">{t('Claim your unique @name on Solana. Yours to own, easy to share.')}</p>
    <div id="search-handles" className="mt-6"><HandleSearch wallet={wallet} personalSearch compact funnel officialClaims /></div>
    <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">{t('One-time payment. No renewals. Yours until you transfer it.')}</p>
    <MobileMintPurpose />
  </section>;
}