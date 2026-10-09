import { useLanguage } from '@/components/i18n/LanguageProvider';

export default function NamesPagination({ page, hasNext, busy, onPrevious, onNext }) {
  const { t } = useLanguage();
  if (page === 1 && !hasNext) return null;
  return <nav aria-label={t('Names pagination')} className="mt-6 flex items-center justify-center gap-3">
    <button type="button" disabled={page === 1 || busy} onClick={onPrevious} className="rounded-lg border border-names-accent/25 px-3 py-2 text-sm text-names-accent disabled:opacity-40">{t('Previous')}</button>
    <span className="text-xs">{t('Page')} {page}</span>
    <button type="button" disabled={!hasNext || busy} onClick={onNext} className="rounded-lg border border-names-accent/25 px-3 py-2 text-sm text-names-accent disabled:opacity-40">{t(busy ? 'Loading…' : 'Next')}</button>
  </nav>;
}