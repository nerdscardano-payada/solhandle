import { useLanguage } from '@/components/i18n/LanguageProvider';
import HandleSearch from '@/components/solhandle/HandleSearch';
import MobileMintPurpose from '@/components/solhandle/home/MobileMintPurpose';

export default function MobileMintHome({ wallet, refreshVersion = 0 }) {
  const { t } = useLanguage();
  return <section className="mx-auto max-w-xl px-5 pb-10 pt-7 text-foreground">
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-names-accent">SolHandle · {t('It starts with your @')}</p>
    <h1 className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight"><span className="block text-names-accent">{t('Your @.')}</span><span className="mt-1 block">{t('Your identity on Solana.')}</span></h1>
    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t('Mint it once. Use it for contacts, payments and supported Solana apps.')}</p>
    <div className="mt-6"><label htmlFor="home-handle-input" className="mb-3 block text-sm font-semibold">{t('Find your @handle')}</label><HandleSearch wallet={wallet} refreshVersion={refreshVersion} personalSearch compact funnel officialClaims hideEmptyHint /></div>
    <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">{t('One-time payment. No renewals. Yours until you transfer it.')}</p>
    <MobileMintPurpose />
  </section>;
}