import { Flame, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const number = (value, decimals = 0) => value == null ? '—' : Number(value).toLocaleString('en-US', { maximumFractionDigits: decimals });

export default function FlywheelMobileMetrics({ stats, progress }) {
  return <div className="mt-4 grid grid-cols-2 gap-3">
    <div className="min-w-0 rounded-xl border border-burn-accent/25 bg-burn-accent/5 p-3"><p className="flex items-center gap-2 text-xs text-burn-accent"><Flame className="h-4 w-4" />$HANDLE burned</p><strong className="mt-2 block break-words text-xl">{number(stats.handleBurned)}</strong></div>
    <div className="min-w-0 rounded-xl border border-names-secondary/25 bg-names-secondary/5 p-3"><p className="flex items-center gap-2 text-xs text-names-secondary"><ShoppingBag className="h-4 w-4" />$HANDLE bought</p><strong className="mt-2 block break-words text-xl">{number(stats.handleBought)}</strong></div>
    <div className="min-w-0 rounded-xl border border-names-accent/25 bg-names-accent/5 p-3"><p className="text-xs text-names-accent">Indicative budget</p><strong className="mt-2 block break-words text-lg">{number(stats.buybackEarmarkedSol, 4)} SOL</strong><p className="mt-1 text-[10px] text-names-secondary">Not available treasury funds</p></div>
    <Link to="/growth" className="min-w-0 rounded-xl border border-names-success/25 bg-names-success/5 p-3"><p className="text-xs text-names-success">Growth Curve ↗</p><strong className="mt-2 block text-xl">{progress == null ? '—' : `${progress}%`}</strong><p className="mt-1 text-[10px] text-names-secondary">Official progress</p></Link>
  </div>;
}