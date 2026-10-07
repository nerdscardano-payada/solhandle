export default function CompactDisclosure({ compact = false, label, children }) {
  if (!compact) return <>{children}</>;
  return <details className="mt-3">
    <summary className="cursor-pointer text-sm text-names-accent/80 transition-colors hover:text-names-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-names-accent">{label}</summary>
    <div className="mt-3">{children}</div>
  </details>;
}