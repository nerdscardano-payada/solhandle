import { useLanguage } from '@/components/i18n/LanguageProvider';
export default function SolPayPending({ pending, busy, onRecover }) {
  const { t } = useLanguage();
  return <section role="status" aria-live="polite" className="space-y-3 rounded-xl border border-names-warning/30 bg-names-warning/5 p-4">
    <h2 className="font-semibold text-names-warning">{t('Payment awaiting confirmation')}</h2>
    <p className="text-sm">{pending.amountLamports / 1e9} SOL → @{pending.handle.replace(/^@/, '')}</p>
    <p className="text-xs text-muted-foreground">{t('Not confirmed yet. Do not send again while this transaction is pending.')}</p>
    <a href={`https://explorer.solana.com/tx/${pending.signature}`} target="_blank" rel="noopener noreferrer" className="block text-sm text-names-accent underline">{t('Check transaction on Explorer')}</a>
    <button type="button" disabled={busy} onClick={onRecover} className="min-h-11 text-sm font-semibold text-names-accent underline disabled:opacity-50">{t(busy ? 'Checking confirmation…' : 'Check confirmation again')}</button>
  </section>;
}