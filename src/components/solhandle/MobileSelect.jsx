import { useState } from 'react';
import { Drawer } from 'vaul';
import { Check, ChevronDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function MobileSelect({ label, value, onChange, options, className }) {
  const mobile = useIsMobile();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  if (!mobile) return <select aria-label={t(label)} value={value} onChange={event => onChange(event.target.value)} className={className}>{options.map(option => <option key={option.value} value={option.value}>{t(option.label)}</option>)}</select>;
  return <Drawer.Root open={open} onOpenChange={setOpen} shouldScaleBackground={false}>
    <Drawer.Trigger type="button" aria-label={t(label)} className={`${className} flex w-full items-center justify-between gap-3 text-left`}><span>{t(options.find(option => option.value === value)?.label || label)}</span><ChevronDown className="h-4 w-4 shrink-0"/></Drawer.Trigger>
    <Drawer.Portal><Drawer.Overlay className="fixed inset-0 z-[90] bg-hero-canvas/80"/>
      <Drawer.Content aria-describedby={undefined} className="dark fixed inset-x-0 bottom-0 z-[91] flex max-h-[80dvh] flex-col rounded-t-2xl border border-border bg-card text-foreground outline-none" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div aria-hidden="true" className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-muted"/>
        <Drawer.Title className="p-5 text-center text-lg font-semibold">{t(label)}</Drawer.Title>
        <div role="group" aria-label={t(label)} className="overflow-y-auto overscroll-contain px-4" data-vaul-no-drag>
          {options.map(option => <button key={option.value} type="button" aria-pressed={option.value === value} onClick={() => { onChange(option.value); setOpen(false); }} className="flex min-h-12 w-full items-center justify-between gap-3 border-b border-border px-3 py-3 text-left text-sm focus-visible:outline focus-visible:outline-names-accent"><span>{t(option.label)}</span>{option.value === value && <Check className="h-5 w-5 text-names-accent"/>}</button>)}
        </div>
        <Drawer.Close type="button" className="m-4 min-h-12 rounded-xl bg-muted text-sm font-semibold">{t('Cancel')}</Drawer.Close>
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>;
}