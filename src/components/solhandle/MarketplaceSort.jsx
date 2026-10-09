import { useLanguage } from '@/components/i18n/LanguageProvider';

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
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border border-white/10 bg-[#151a23] px-3 py-2 text-sm text-white outline-none focus:border-cyan-300/60"
      >
        {options.map(([optionValue, label]) => (
          <option key={optionValue} value={optionValue}>{t(label)}</option>
        ))}
      </select>
    </label>
  );
}