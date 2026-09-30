import { Flame, Activity, Coins, Clock } from 'lucide-react';
const amount = value => Number(value).toLocaleString('en-US', { maximumFractionDigits: 6 });
export default function BurnDashboardStats({ stats }) {
  const metrics = [
    { label: 'Total recorded burn', value: `${amount(stats.totalBurned)} $HANDLE`, Icon: Flame, color: 'text-burn-accent' },
    { label: 'Confirmed burn transactions', value: amount(stats.burnTransactions), Icon: Activity, color: 'text-burn-highlight' },
    { label: 'Verified $HANDLE-paid mints', value: amount(stats.automaticMints), Icon: Coins, color: 'text-burn-secondary' },
    { label: 'Latest recorded burn', value: stats.lastBurn ? new Date(stats.lastBurn).toLocaleDateString('en-GB') : 'No burns yet', Icon: Clock, color: 'text-burn-accent' },
  ];
  return <section aria-label="Burn totals" className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{metrics.map(({ label, value, Icon, color }) => <div key={label} className="min-w-0 rounded-2xl border border-burn-accent/20 bg-card p-5"><Icon aria-hidden="true" className={`h-5 w-5 ${color}`}/><p className={`mt-4 break-words text-2xl font-semibold ${color}`}>{value}</p><p className="mt-2 text-sm text-muted-foreground">{label}</p></div>)}</section>;
}