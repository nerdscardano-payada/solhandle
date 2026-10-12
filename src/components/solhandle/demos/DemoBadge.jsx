export default function DemoBadge({ live = false }) {
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-wider ${live ? 'border-names-success/30 bg-names-success/10 text-names-success' : 'border-names-secondary/30 bg-names-secondary/10 text-names-secondary'}`}>{live ? 'LIVE' : 'INTEGRATION DEMO'}</span>;
}