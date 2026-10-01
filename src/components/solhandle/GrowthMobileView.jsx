import { RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import GrowthProgressBar from '@/components/solhandle/GrowthProgressBar';
import GrowthMilestones from '@/components/solhandle/GrowthMilestones';
import MobileGrowthSignals from '@/components/solhandle/MobileGrowthSignals';
import GrowthMobileExplanation from '@/components/solhandle/GrowthMobileExplanation';

export default function GrowthMobileView({ data, error, refreshing, checkedAt, load, cycle, newHolders, handles, holders, marketCap, targetCap, capProgress, liveProgress, officialProgress, next, source }) {
  return <section className="px-5 py-6 sm:hidden">
    <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-widest text-names-accent">$HANDLE · Mainnet</p><h1 className="mt-2 font-heading text-3xl font-semibold">Growth Curve</h1></div><button type="button" onClick={load} disabled={refreshing} aria-label="Refresh cycle" className="rounded-xl border border-names-accent/30 p-2.5 text-names-accent disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} /></button></div>
    {error ? <p role="alert" className="mt-6 text-destructive">{error}</p> : !data ? <p className="mt-6 text-names-accent">Loading verified progress…</p> : !cycle ? <p className="mt-6 text-sm text-names-secondary">The first cycle is waiting for a verified mainnet measurement.</p> : <>
      <div className="mt-5 rounded-2xl border border-names-accent/30 bg-names-accent/5 p-4">
        <p className="text-xs text-names-accent">Cycle {cycle.cycle_number}</p>
        <p className="mt-2 text-4xl font-semibold">{liveProgress}% <span className="text-sm font-normal text-names-secondary">live indication</span></p>
        <GrowthProgressBar progress={liveProgress} officialProgress={officialProgress ?? 0} />
        <div className="mt-2 space-y-1 text-xs"><p className="text-names-success">Official: {officialProgress === null ? 'awaiting hourly snapshot' : `${officialProgress}% · hourly snapshot`}</p><p className="text-names-secondary">{next ? `Next official reward at ${next}%` : 'All official milestones reached'}</p></div>
      </div>
      <MobileGrowthSignals cycle={cycle} newHolders={newHolders} handles={handles} holders={holders} marketCap={marketCap} targetCap={targetCap} capProgress={capProgress} />
      <GrowthMilestones progress={officialProgress ?? 0} cycle={cycle.cycle_number} compact />
    </>}
    <div className="mt-5 grid grid-cols-2 gap-3"><Link to="/growth/handle-mint-payments" className="rounded-xl border border-names-accent/25 px-3 py-3 text-center text-sm font-semibold text-names-accent">Mint with $HANDLE →</Link><Link to="/growth/burn" className="rounded-xl border border-burn-accent/25 px-3 py-3 text-center text-sm font-semibold text-burn-accent">Burn Dashboard →</Link></div>
    {!error && cycle && <GrowthMobileExplanation data={data} cycle={cycle} targetCap={targetCap} checkedAt={checkedAt} source={source} />}
    {!error && data?.completed_cycles?.length > 0 && <details className="mt-5 border-t border-names-accent/20 pt-4"><summary className="cursor-pointer text-sm text-names-accent">Completed cycles</summary><p className="mt-2 text-xs text-names-secondary">{data.completed_cycles.map(item => `Cycle ${item.cycle_number}`).join(' · ')} · completion does not mean rewards have already been delivered.</p></details>}
  </section>;
}