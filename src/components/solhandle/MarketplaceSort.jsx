import { useLanguage } from '@/components/i18n/LanguageProvider';
import MobileSelect from '@/components/solhandle/MobileSelect';

const options = [
  ["newest", "Newest first"],
  ["oldest", "Oldest first"],
  ["price-asc", "Price: low to high"],
  ["price-desc", "Price: high to low"],
  ["length-asc", "Handle: shortest first"],
  ["length-desc", "Handle: longest first"],
];

export default function MarketplaceSort({ value, onChange }) {
  const { t } = useLanguage();
  return (
    <label className="flex items-center gap-2 text-xs text-slate-400">
      <span className="hidden sm:inline">{t('Sort by')}</span>
      <MobileSelect label={t('Sort by')} value={value} onChange={onChange} options={options.map(([optionValue, label]) => ({ value: optionValue, label: t(label) }))} className="min-h-11 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-names-accent"/>
    </label>
  );
}