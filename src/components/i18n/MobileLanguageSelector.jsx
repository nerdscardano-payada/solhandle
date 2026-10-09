import { languages } from '@/components/i18n/translations';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const flags = { en: '🇬🇧', es: '🇪🇸', pt: '🇵🇹', ja: '🇯🇵', nl: '🇳🇱', de: '🇩🇪', fr: '🇫🇷', tr: '🇹🇷', it: '🇮🇹', vi: '🇻🇳', ko: '🇰🇷' };

export default function MobileLanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const currentLabel = languages.find(([code]) => code === language)?.[1];
  return <DropdownMenu>
    <DropdownMenuTrigger aria-label={`${t('Language')}: ${currentLabel}`} title={t('Language')} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-xl text-foreground">
      <span aria-hidden="true">{flags[language]}</span>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="dark max-h-80 overflow-y-auto border-border bg-card text-card-foreground">
      <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
        {languages.map(([code, label]) => <DropdownMenuRadioItem key={code} value={code} lang={code} className="min-h-11 gap-2">
          <span aria-hidden="true">{flags[code]}</span>{label}
        </DropdownMenuRadioItem>)}
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>;
}