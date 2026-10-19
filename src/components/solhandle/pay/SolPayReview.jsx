import { useLanguage } from '@/components/i18n/LanguageProvider';
export default function SolPayReview({ quote, amountLamports, busy, onSend, onEdit }) {
  const { t, language } = useLanguage();
  const sol = value => (Number(value) / 1e9).toLocaleString(language, { maximumFractionDigits: 9 });
  return <section className="space-y-4 rounded-xl border border-names-secondary/30 bg-names-secondary/5 p-4">
    <h2 className="font-semibold text-foreground">{t('Review payment')}</h2>
    <dl className="space-y-3 text-sm"><div><dt className="text-muted-foreground">{t('Recipient @handle')}</dt><dd className="mt-1 font-semibold text-names-accent">{quote.displayHandle}</dd></div><div><dt className="text-muted-foreground">{t('Recipient wallet')}</dt><dd data-copyable className="mt-1 break-all font-mono text-xs text-foreground">{quote.destinationAddress}</dd></div></dl>
    <p className="text-xs text-names-warning">{t(quote.savedContact ? quote.handleChanged ? 'This handle changed owners. You are paying the original saved wallet above, not its new owner. Verify the address before approving.' : 'This payment goes to your contact’s fixed, saved wallet address. Verify it before approving.' : 'Handles can change owners. Verify this wallet address before you approve the transaction.')}</p>
    <dl className="space-y-3 border-t border-border pt-4 text-sm"><div className="flex justify-between gap-3"><dt>{t('Amount')}</dt><dd className="font-semibold">{sol(amountLamports)} SOL</dd></div><div className="flex justify-between gap-3 text-muted-foreground"><dt>{t('Network fee')}</dt><dd>~{sol(quote.networkFeeEstimate)} SOL</dd></div><div className="flex justify-between gap-3 text-muted-foreground"><dt>{t('SolHandle fee')}</dt><dd>0 SOL</dd></div><div className="flex justify-between gap-3 border-t border-border pt-3 font-semibold"><dt>{t('Estimated total')}</dt><dd>~{sol(amountLamports + Number(quote.networkFeeEstimate))} SOL</dd></div></dl>
    <p className="text-xs text-muted-foreground">{t('Check the final network fee in your wallet before approving.')}</p>
    <button type="button" onClick={onSend} disabled={busy} className="min-h-12 w-full rounded-xl bg-button-primary px-5 py-3 font-semibold text-button-foreground disabled:opacity-50">{t(busy ? 'Awaiting wallet approval or Solana confirmation…' : 'Send with wallet')}</button>
    <button type="button" onClick={onEdit} disabled={busy} className="min-h-11 w-full text-sm text-muted-foreground underline disabled:opacity-50">{t('Edit payment')}</button>
  </section>;
}