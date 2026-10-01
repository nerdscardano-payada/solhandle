import { Flame, Activity, Coins, Clock } from 'lucide-react';
const amount = value => Number(value).toLocaleString('en-US', { maximumFractionDigits: 6 });
export default function BurnDashboardStats({ stats }) {
  const metrics = [
    { label: 'Total recorded burn', value: `${Number(stats.totalBurned) >= 1_000_000 ? `${(Number(stats.totalBurned) / 1_000_000).toLocaleString('nl-BE', { maximumFractionDigits: 2 })}M` : amount(stats.totalBurned)} $HANDLE`, Icon: Flame, color: 'text-burn-accent' },
    { label: 'Confirmed burn transactions', value: amount(stats.burnTransactions), Icon: Activity, color: 'text-burn-highlight' },
    { label: 'Verified $HANDLE-paid mints', value: amount(stats.automaticMints), Icon: Coins, color: 'text-burn-secondary' },
    { label: 'Latest recorded burn', value: stats.lastBurn ? new Date(stats.lastBurn).toLocaleDateString('en-GB') : 'No burns yet', Icon: Clock, color: 'text-burn-accent' },
  ];
  return <section aria-label="Burn totals" className="mt-4 grid grid-cols-2 gap-3 sm:mt-7 sm:gap-4 lg:grid-cols-4">{metrics.map(({ label, value, Icon, color }) => <div key={label} className="min-w-0 rounded-2xl border border-burn-accent/20 bg-card p-3 sm:p-5"><Icon aria-hidden="true" className={`h-5 w-5 ${color}`}/><p className={`mt-2 break-words text-lg font-semibold sm:mt-4 sm:text-2xl ${color}`}>{value}</p><p className="mt-2 text-xs text-muted-foreground sm:text-sm">{label}</p></div>)}</section>;
}