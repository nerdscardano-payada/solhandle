import { RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import BuybackProof from '@/components/solhandle/BuybackProof';
import FlywheelMobileMetrics from '@/components/solhandle/FlywheelMobileMetrics';
import FlywheelMobileDetails from '@/components/solhandle/FlywheelMobileDetails';

export default function FlywheelMobileView({ stats, metrics, progress, error, refreshing, load }) {
  return <section className="sm:hidden" aria-labelledby="mobile-flywheel-heading">
    <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-widest text-names-accent">SolHandle · Protocol activity</p><h1 id="mobile-flywheel-heading" className="mt-2 font-heading text-3xl font-semibold">Flywheel</h1></div><button type="button" onClick={load} disabled={refreshing} aria-label="Refresh flywheel figures" className="rounded-xl border border-names-accent/30 p-2.5 text-names-accent disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} /></button></div>
    {error && <p role="alert" className="mt-4 text-destructive">{error}</p>}
    {!stats && !error && <p className="mt-4 text-sm text-names-accent">Loading protocol activity…</p>}
    {stats && <>
      <FlywheelMobileMetrics stats={stats} progress={progress} />
      <details className="mt-4 rounded-xl border border-burn-accent/25 p-3"><summary className="cursor-pointer text-sm font-semibold text-burn-accent">On-chain proof · buybacks & burns</summary><div className="mt-3"><BuybackProof proofs={stats.burnProofs} /></div></details>
      <div className="mt-4 grid grid-cols-2 gap-3"><Link to="/growth/burn" className="rounded-xl border border-burn-accent/25 px-3 py-3 text-center text-sm font-semibold text-burn-accent">View burns →</Link><Link to="/growth" className="rounded-xl border border-names-secondary/25 px-3 py-3 text-center text-sm font-semibold text-names-secondary">Growth Curve →</Link></div>
      <FlywheelMobileDetails stats={stats} metrics={metrics} />
    </>}
  </section>;
}