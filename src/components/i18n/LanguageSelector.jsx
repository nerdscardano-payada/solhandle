import { Globe } from 'lucide-react';
import { languages } from '@/components/i18n/translations';
import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  return <label className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-lg border border-border bg-card px-2 text-xs text-foreground">
    <Globe className="h-4 w-4 shrink-0" aria-hidden="true"/>
    <span className="sr-only">{t('Language')}</span>
    <select aria-label={t('Language')} value={language} onChange={event => setLanguage(event.target.value)} className="min-h-10 max-w-24 cursor-pointer bg-card text-foreground outline-none">
      {languages.map(([code, label]) => <option key={code} value={code} lang={code}>{label}</option>)}
    </select>
  </label>;
}