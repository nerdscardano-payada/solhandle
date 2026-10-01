import BuybackAllocation from '@/components/solhandle/BuybackAllocation';
import FlywheelStages from '@/components/solhandle/FlywheelStages';

export default function FlywheelMobileDetails({ stats, metrics }) {
  return <div className="mt-4 space-y-3">
    <details className="rounded-xl border border-names-accent/20 p-3"><summary className="cursor-pointer text-sm font-semibold text-names-accent">All protocol figures</summary><dl className="mt-3 space-y-3">{metrics.map(([label, value]) => <div key={label} className="flex items-start justify-between gap-3 text-xs"><dt className="min-w-0 text-names-secondary">{label}</dt><dd className="shrink-0 font-semibold">{value}</dd></div>)}</dl><p className="mt-4 text-xs leading-relaxed text-names-secondary">Figures include recorded direct mints and native marketplace sales only. Purchases and burns use confirmed on-chain signatures; SOL spending is admin-reported. Mint totals follow the latest protocol sync.</p><p className="mt-3 text-xs text-names-secondary">Calculated {new Date(stats.measuredAt).toLocaleTimeString('en-GB')} · protocol synced {stats.lastSync ? new Date(stats.lastSync).toLocaleString('en-GB') : 'not yet'}.</p></details>
    <details className="rounded-xl border border-names-accent/20 p-3"><summary className="cursor-pointer text-sm font-semibold text-names-accent">Buyback budget & allocation</summary><BuybackAllocation stats={stats} /></details>
    <details className="rounded-xl border border-names-accent/20 p-3"><summary className="cursor-pointer text-sm font-semibold text-names-accent">How does the flywheel work?</summary><FlywheelStages compact /></details>
  </div>;
}