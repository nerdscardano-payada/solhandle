import { useState } from 'react';
import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function PaymentSendButton({ quote, busy, onSend, children, className }) {
  const { t } = useLanguage();
  const [acknowledgedQuote, setAcknowledgedQuote] = useState(null);
  const needsConfirmation = Boolean(quote.savedContact && quote.handleChanged);
  const confirmed = !needsConfirmation || acknowledgedQuote === quote;
  return <>
    {needsConfirmation && <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-names-warning/40 bg-names-warning/5 p-3 text-sm text-foreground">
      <input type="checkbox" checked={confirmed} disabled={busy} onChange={event => setAcknowledgedQuote(event.target.checked ? quote : null)} className="mt-1 h-4 w-4 shrink-0"/>
      <span>{t('I checked the wallet address above. I want to pay my saved contact, not the new owner of this handle.')}</span>
    </label>}
    <button type="button" disabled={busy || !confirmed} onClick={() => { if (!busy && confirmed) onSend(); }} className={className}>{children}</button>
  </>;
}