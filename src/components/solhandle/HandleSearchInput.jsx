import { Search } from 'lucide-react';
import { useLanguage } from '@/components/i18n/LanguageProvider';
export default function HandleSearchInput({ input, onChange, placeholder = '' }) {
  const { t } = useLanguage();
  return <div className="dark text-foreground"><label className="flex min-w-0 items-center rounded-xl border border-names-accent/50 bg-card px-4 py-3"><Search className="mr-3 h-4 w-4 shrink-0 text-muted-foreground"/><span className="mr-1 text-muted-foreground">@</span><input value={input} placeholder={placeholder} onChange={event => onChange(event.target.value)} className="min-w-0 w-full bg-transparent outline-none" aria-label={t('Search handle')}/><span className="ml-2 text-xs text-muted-foreground">{input.replace(/^@+/, '').length}/20</span></label></div>;
}