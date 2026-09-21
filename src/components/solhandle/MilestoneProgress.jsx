export default function MilestoneProgress({ milestone }) {
  const delivered = milestone.completed.length;
  const total = delivered + (milestone.upcoming?.length || 0);
  const percentage = total ? Math.round((delivered / total) * 100) : 0;
  return <div className="dark mt-5 rounded-xl border border-border bg-card p-4 text-card-foreground">
    <div className="flex flex-wrap items-center justify-between gap-2 text-sm"><span className="font-medium">Roadmap progress</span><span className="text-muted-foreground">{delivered} of {total} steps delivered · {percentage}%</span></div>
    <div role="progressbar" aria-label={`${milestone.title}: roadmap steps delivered`} aria-valuemin={0} aria-valuemax={total} aria-valuenow={delivered} aria-valuetext={`${delivered} of ${total} listed steps delivered`} className="mt-3 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-chart-2" style={{ width: `${percentage}%` }} /></div>
    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Based on the steps listed below, not a launch date or an estimate of development time.</p>
  </div>;
}