const usd = value => value == null ? '—' : `$${new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value)}`;

export default function MobileGrowthSignals({ cycle, newHolders, handles, holders, marketCap, targetCap, capProgress }) {
  const signals = [
    { label: 'New mints · 40%', value: `${Math.max(0, cycle.handles_now - cycle.handles_start)} / ${cycle.handles_target}`, progress: handles },
    { label: 'Qualified holders · 40%', value: `${newHolders} / ${cycle.holders_target}`, progress: holders },
    { label: 'Market cap · 20%', value: `${usd(marketCap)} / ${usd(targetCap)}`, progress: capProgress }
  ];
  return <div className="mt-3 space-y-3 rounded-2xl border border-names-accent/20 bg-names-accent/5 p-4">{signals.map(signal => <div key={signal.label}>
    <div className="flex items-center justify-between gap-2 text-xs"><span>{signal.label}</span><strong className="shrink-0 text-names-accent">{signal.value}</strong></div>
    <div role="progressbar" aria-label={signal.label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={signal.progress} className="mt-2 h-1.5 overflow-hidden rounded-full bg-names-accent/10"><div className="h-full rounded-full bg-gradient-to-r from-names-success to-names-accent" style={{ width: `${signal.progress}%` }} /></div>
  </div>)}</div>;
}