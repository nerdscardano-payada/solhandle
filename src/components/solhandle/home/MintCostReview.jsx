import { lamportsToSol } from '@/lib/solhandle';
import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function MintCostReview({ costs, onApprove, onCancel }) {
  const { t } = useLanguage();
  if (!costs) return null;
  return <section className="dark rounded-xl border border-names-accent/30 bg-card p-4 text-card-foreground" aria-label={t('Review estimated SOL total')} aria-live="polite">
    <h3 className="font-semibold">{t('Review your estimated SOL total')}</h3>
    <dl className="mt-3 space-y-2 text-sm">{[['Name price', costs.priceLamports], ['NFT and account creation', costs.accountCostsLamports], ['Network fee', costs.networkFeeLamports]].map(([label, value]) => <div key={label} className="flex justify-between gap-3"><dt className="text-muted-foreground">{t(label)}</dt><dd>{lamportsToSol(value)} SOL</dd></div>)}<div className="flex justify-between gap-3 border-t border-border pt-3 font-semibold"><dt>{t('Estimated total')}</dt><dd>{lamportsToSol(costs.totalLamports)} SOL</dd></div></dl>
    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{t('Estimated from an on-chain simulation. Your wallet shows the final transaction; wallet-added fees may differ. No transaction has been sent.')}</p>
    <button type="button" onClick={onApprove} className="home-primary-button mt-4 w-full">{t('Continue to wallet approval')}</button><button type="button" onClick={onCancel} className="mt-3 w-full text-sm text-muted-foreground underline">{t('Cancel')}</button>
  </section>;
}