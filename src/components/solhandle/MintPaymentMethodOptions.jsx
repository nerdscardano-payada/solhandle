import { CheckCircle2, Flame, Wallet } from 'lucide-react';
import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function MintPaymentMethodOptions({ method, onChange, busy }) {
  const { t } = useLanguage();
  const options = [
    { value: 'SOL', label: 'SOL', description: 'Pay in SOL', Icon: Wallet },
    { value: 'HANDLE', label: '$HANDLE', description: '50% burned on-chain', Icon: Flame }
  ];
  return <div className="dark space-y-3">
    <div id="mint-payment-method-label"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('Payment method')}</p><h3 className="mt-1 text-lg font-semibold text-foreground">{t('Make a choice')}</h3></div>
    <div className="grid grid-cols-2 gap-3" role="group" aria-labelledby="mint-payment-method-label">
      {options.map(({ value, label, description, Icon }) => {
        const selected = method === value;
        const isToken = value === 'HANDLE';
        return <button key={value} type="button" aria-pressed={selected} disabled={busy} onClick={() => onChange(value)} className={`min-w-0 rounded-xl border-2 p-3 text-left disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${selected ? isToken ? 'border-burn-accent bg-burn-accent/10 text-foreground' : 'border-primary bg-primary/10 text-foreground' : 'border-border bg-card text-foreground hover:border-muted-foreground'}`}>
          <span className="flex items-center justify-between gap-2"><Icon className={isToken ? 'h-5 w-5 text-burn-accent' : 'h-5 w-5 text-foreground'} />{selected && <CheckCircle2 className={isToken ? 'h-4 w-4 shrink-0 text-burn-accent' : 'h-4 w-4 shrink-0 text-foreground'} />}</span>
          <span className="mt-3 block text-base font-semibold">{label}</span>
          <span className={isToken ? 'mt-1 block text-xs leading-relaxed text-burn-accent' : 'mt-1 block text-xs leading-relaxed text-muted-foreground'}>{t(description)}</span>
        </button>;
      })}
    </div>
  </div>;
}