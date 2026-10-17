import { useState } from 'react';
import { Drawer } from 'vaul';
import { Check } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { languages } from '@/components/i18n/translations';
import { useLanguage } from '@/components/i18n/LanguageProvider';
const flags = { en: 'gb', es: 'es', pt: 'pt', ja: 'jp', nl: 'nl', de: 'de', fr: 'fr', tr: 'tr', it: 'it', vi: 'vn', ko: 'kr' };
export default function MobileLanguageDrawer() {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const current = languages.find(([code]) => code === language)?.[1];
  return <Drawer.Root open={open} onOpenChange={setOpen} shouldScaleBackground={false}>
    <Drawer.Trigger aria-label={`${t('Language')}: ${current}`} title={t('Language')} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-foreground"><Image src={`https://flagcdn.com/${flags[language]}.svg`} alt="" aria-hidden="true" className="h-5 w-7 object-contain" fittingType="fit"/></Drawer.Trigger>
    <Drawer.Portal><Drawer.Overlay className="fixed inset-0 z-[90] bg-hero-canvas/80"/>
      <Drawer.Content aria-describedby={undefined} className="dark fixed inset-x-0 bottom-0 z-[91] flex max-h-[80dvh] flex-col rounded-t-2xl border border-border bg-card text-foreground outline-none" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div aria-hidden="true" className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-muted"/>
        <Drawer.Title className="p-5 text-center text-lg font-semibold">{t('Language')}</Drawer.Title>
        <div role="group" aria-label={t('Language')} data-vaul-no-drag className="overflow-y-auto overscroll-contain px-4">{languages.map(([code, label]) => <button key={code} type="button" lang={code} aria-pressed={code === language} onClick={() => { setLanguage(code); setOpen(false); }} className="flex min-h-12 w-full items-center gap-3 border-b border-border px-3 py-3 text-left text-sm"><Image src={`https://flagcdn.com/${flags[code]}.svg`} alt="" aria-hidden="true" className="h-4 w-6 shrink-0 object-contain" fittingType="fit"/><span data-no-translate>{label}</span>{code === language && <Check className="ml-auto h-5 w-5 text-names-accent"/>}</button>)}</div>
        <Drawer.Close type="button" className="m-4 min-h-12 rounded-xl bg-muted text-sm font-semibold">{t('Cancel')}</Drawer.Close>
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>;
}