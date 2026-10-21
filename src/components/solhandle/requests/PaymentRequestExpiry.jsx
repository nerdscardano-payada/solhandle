import { useLanguage } from '@/components/i18n/LanguageProvider';

const options = [
  { value: '', label: 'No expiry' },
  { value: '1', label: '1 hour' },
  { value: '24', label: '24 hours' },
  { value: '168', label: '7 days' },
];

export default function PaymentRequestExpiry({ value, onChange }) {
  const { t } = useLanguage();
  return <fieldset>
    <legend className="text-sm">{t('Valid for (optional)')}</legend>
    <div className="mt-2 grid grid-cols-2 gap-2 width-min-[480px]:grid-cols-4">
      {options.map(option => <label key={option.value} className="relative cursor-pointer">
        <input type="radio" name="request-expiry" value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} className="peer sr-only"/>
        <span className="flex min-h-12 items-center justify-center rounded-xl border border-border bg-card px-3 py-3 text-center text-sm text-muted-foreground peer-checked:border-names-accent peer-checked:bg-names-accent/10 peer-checked:font-semibold peer-checked:text-names-accent peer-focus-visible:ring-2 peer-focus-visible:ring-names-accent peer-disabled:opacity-50">{t(option.label)}</span>
      </label>)}
    </div>
  </fieldset>;
}