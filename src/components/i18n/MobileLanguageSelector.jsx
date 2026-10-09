import { languages } from '@/components/i18n/translations';
import { Image } from '@/components/ui/image';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const flags = { en: 'gb', es: 'es', pt: 'pt', ja: 'jp', nl: 'nl', de: 'de', fr: 'fr', tr: 'tr', it: 'it', vi: 'vn', ko: 'kr' };

export default function MobileLanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const currentLabel = languages.find(([code]) => code === language)?.[1];
  return <DropdownMenu>
    <DropdownMenuTrigger aria-label={`${t('Language')}: ${currentLabel}`} title={t('Language')} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-xl text-foreground">
      <Image src={`https://flagcdn.com/${flags[language]}.svg`} alt="" aria-hidden="true" className="h-5 w-7 object-contain" fittingType="fit" />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="dark max-h-80 overflow-y-auto border-border bg-card text-card-foreground">
      <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
        {languages.map(([code, label]) => <DropdownMenuRadioItem key={code} value={code} lang={code} className="min-h-11 gap-2">
          <Image src={`https://flagcdn.com/${flags[code]}.svg`} alt="" aria-hidden="true" className="h-4 w-6 shrink-0 object-contain" fittingType="fit" />{label}
        </DropdownMenuRadioItem>)}
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>;
}