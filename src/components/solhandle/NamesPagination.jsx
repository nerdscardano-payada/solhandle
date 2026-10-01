export default function NamesPagination({ page, hasNext, busy, onPrevious, onNext }) {
  if (page === 1 && !hasNext) return null;
  return <nav aria-label="Names pagination" className="mt-6 flex items-center justify-center gap-3">
    <button type="button" disabled={page === 1 || busy} onClick={onPrevious} className="rounded-lg border border-names-accent/25 px-3 py-2 text-sm text-names-accent disabled:opacity-40">Previous</button>
    <span className="text-xs">Page {page}</span>
    <button type="button" disabled={!hasNext || busy} onClick={onNext} className="rounded-lg border border-names-accent/25 px-3 py-2 text-sm text-names-accent disabled:opacity-40">{busy ? 'Loading…' : 'Next'}</button>
  </nav>;
}