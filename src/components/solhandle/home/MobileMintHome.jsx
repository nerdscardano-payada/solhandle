import { useLanguage } from '@/components/i18n/LanguageProvider';
import HandleSearch from '@/components/solhandle/HandleSearch';
import MobileMintPurpose from '@/components/solhandle/home/MobileMintPurpose';

export default function MobileMintHome({ wallet, refreshVersion = 0 }) {
  const { t } = useLanguage();
  return <section className="mx-auto max-w-xl px-5 pb-7 pt-5 text-foreground">
    <div className="rounded-2xl border border-names-accent/20 bg-card p-4">
    <h1 className="text-[clamp(1.5rem,7.8vw,1.75rem)] font-semibold leading-tight tracking-tight text-balance"><span className="text-names-accent">{t('Your @.')}</span>{' '}<span>{t('Your identity on Solana.')}</span></h1>
    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t('Mint it once. Use it for contacts, payments and supported Solana apps.')}</p>
    <div className="mt-5"><label htmlFor="home-handle-input" className="mb-2 block text-sm font-medium">{t('Find your @handle')}</label><HandleSearch wallet={wallet} refreshVersion={refreshVersion} personalSearch compact funnel officialClaims hideEmptyHint /></div>
    <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">{t('One-time payment. No renewals. Yours until you transfer it.')}</p>
    </div>
    <MobileMintPurpose />
  </section>;
}