import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Flame, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import FlywheelStages from '@/components/solhandle/FlywheelStages';
import { base44 } from '@/api/base44Client';
import BuybackAllocation from '@/components/solhandle/BuybackAllocation';
import BuybackProof from '@/components/solhandle/BuybackProof';
import FlywheelMobileView from '@/components/solhandle/FlywheelMobileView';

const display = (value, decimals = 0) => value == null ? '—' : Number(value).toLocaleString('en-US', { maximumFractionDigits: decimals });

export default function FlywheelDashboard({ progress }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await base44.functions.invoke('flywheelStats', {});
      setStats(res.data);
      setError('');
    } catch {
      setError('Flywheel figures are temporarily unavailable.');
    } finally {
      setRefreshing(false);
    }
  }, []);
  useEffect(() => { load(); const timer = setInterval(load, 60000); return () => clearInterval(timer); }, [load]);
  const metrics = stats && [
    ['SolHandles minted', display(stats.totalMinted)],
    ['SolHandle Pay transactions', display(stats.payTransactions)],
    ['Marketplace volume', `${display(stats.marketplaceVolumeSol, 3)} SOL`],
    ['Royalty generated', `${display(stats.royaltyGeneratedSol, 4)} SOL`],
    ['Indicative buyback budget · 10% mint + 1% resale', `${display(stats.buybackEarmarkedSol, 4)} SOL`],
    ['$HANDLE bought', display(stats.handleBought)],
    ['$HANDLE burned', display(stats.handleBurned)],
    ['Buyback SOL spent · admin-reported', `${display(stats.buybackSpentReportedSol, 4)} SOL`]
  ];
  return <><FlywheelMobileView stats={stats} metrics={metrics} progress={progress} error={error} refreshing={refreshing} load={load}/><section className="relative mt-8 hidden overflow-hidden sm:block rounded-3xl border border-cyan-300/20 bg-slate-950/80 p-5 shadow-[0_0_60px_rgba(34,211,238,0.08)] sm:p-8" aria-labelledby="flywheel-heading">
    <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl"/>
    <div className="relative"><p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">Protocol activity · explore the loop</p>
    <h1 id="flywheel-heading" className="mt-2 text-3xl font-semibold sm:text-5xl">The SolHandle <span className="bg-gradient-to-r from-cyan-200 via-white to-violet-300 bg-clip-text text-transparent">Flywheel</span></h1>
    <p className="mt-3 text-sm text-slate-400">Tap each step to see how SolHandle activity connects.</p>
    {stats && <div className="mt-5"><BuybackProof proofs={stats.burnProofs}/></div>}
    <FlywheelStages />
    <div className="mt-8 flex flex-wrap items-end justify-between gap-3"><h2 className="text-lg font-semibold">Flywheel in numbers</h2><div className="flex items-center gap-3"><p className="text-xs text-slate-400">{stats ? `Calculated ${new Date(stats.measuredAt).toLocaleTimeString('en-GB')} · protocol synced ${stats.lastSync ? new Date(stats.lastSync).toLocaleString('en-GB') : 'not yet'}` : 'Updating…'}</p><button type="button" onClick={load} disabled={refreshing} className="inline-flex items-center gap-1 rounded-lg border border-cyan-300/30 px-3 py-1.5 text-xs text-cyan-200 hover:bg-cyan-300/10 disabled:opacity-50" aria-label="Refresh flywheel figures"><RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`}/>Refresh</button></div></div>
    {error && <p role="alert" className="mt-4 text-rose-300">{error}</p>}
    {!stats && !error && <p className="mt-4 text-cyan-200">Loading protocol activity…</p>}
    {metrics && <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">{metrics.map(([label, value]) => <div key={label} className="rounded-xl border border-white/10 bg-slate-900/60 p-4"><strong className="flex items-center gap-2 text-xl text-cyan-100 sm:text-2xl">{label === '$HANDLE bought' && <ShoppingBag aria-hidden="true" className="buyback-bought-glow h-5 w-5 shrink-0 text-violet-300 sm:h-6 sm:w-6"/>}{label === '$HANDLE burned' && <Flame aria-hidden="true" className="buyback-burn-flicker h-5 w-5 shrink-0 text-orange-300 sm:h-6 sm:w-6"/>}{value}</strong><span className="mt-2 block text-xs leading-relaxed text-slate-400">{label}</span></div>)}<Link to="/growth" className="rounded-xl border border-violet-300/25 bg-slate-900/70 p-4 transition-colors hover:border-violet-300/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-300" aria-label="View the Growth Curve and official progress"><strong className="block text-xl text-violet-200 sm:text-2xl">{progress == null ? '—' : `${progress}%`}</strong><span className="mt-2 block text-xs text-slate-400">Growth Curve · official progress ↗</span></Link></div>}
    {stats && <BuybackAllocation stats={stats}/>}
    <p className="mt-4 text-xs leading-relaxed text-slate-500">Figures include recorded direct mints and native marketplace sales only. $HANDLE purchases and burns are recorded by admins using confirmed on-chain signatures; buyback SOL spending is admin-reported. The mint total follows the latest protocol sync.</p>
    </div>
  </section></>;
}