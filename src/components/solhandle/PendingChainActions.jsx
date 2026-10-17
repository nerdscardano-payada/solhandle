import { useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useLanguage } from '@/components/i18n/LanguageProvider';
const labels = { mint: 'Minting…', list: 'List for sale', bid: 'Place bid' };
export default function PendingChainActions({ wallet, handle, actions }) {
  const { t, language } = useLanguage();
  const { data = [] } = useQuery({ queryKey: ['pending-chain-actions', wallet], queryFn: async () => [], enabled: false, initialData: [], gcTime: Infinity });
  const pending = data.filter(row => (!handle || row.handle === handle) && (!actions || actions.includes(row.action)));
  if (!wallet || !pending.length) return null;
  return <div role="status" aria-live="polite" className="my-3 space-y-2">{pending.map(row => <div key={row.id} className="flex items-center gap-3 rounded-xl border border-names-accent/25 bg-names-accent/5 p-3 text-sm">
    <LoaderCircle className="h-4 w-4 shrink-0 animate-spin text-names-accent" aria-hidden="true"/>
    <div className="min-w-0"><p>{t(labels[row.action] || 'Confirming…')} <span data-no-translate className="break-all">@{row.handle}</span>{row.amount > 0 && <span data-no-translate> · {(row.amount / 1e9).toLocaleString(language, { maximumFractionDigits: 9 })} SOL</span>}</p><p className="text-xs text-muted-foreground">{t('Confirmation pending')}</p></div>
  </div>)}</div>;
}