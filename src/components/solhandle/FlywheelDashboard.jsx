import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import BuybackAllocation from '@/components/solhandle/BuybackAllocation';

const stages = ['Mint @', 'Use @', 'Pay / trade / share', 'Protocol activity', '$HANDLE rewards + buybacks', 'More attention & adoption'];
const display = (value, decimals = 0) => value == null ? '—' : Number(value).toLocaleString('en-US', { maximumFractionDigits: decimals });

export default function FlywheelDashboard({ progress }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    const load = () => base44.functions.invoke('flywheelStats', {}).then(res => { if (active) { setStats(res.data); setError(''); } }).catch(() => { if (active) setError('Flywheel figures are temporarily unavailable.'); });
    load();
    const timer = setInterval(load, 60000);
    return () => { active = false; clearInterval(timer); };
  }, []);
  const metrics = stats && [
    ['SolHandles minted', display(stats.totalMinted)],
    ['SolHandle Pay transactions', display(stats.payTransactions)],
    ['Marketplace volume', `${display(stats.marketplaceVolumeSol, 3)} SOL`],
    ['Royalty generated', `${display(stats.royaltyGeneratedSol, 4)} SOL`],
    ['Indicative buyback budget · 10% mint + 1% resale', `${display(stats.buybackEarmarkedSol, 4)} SOL`],
    ['$HANDLE bought', display(stats.handleBought)],
    ['$HANDLE burned', display(stats.handleBurned)]
  ];
  return <section className="mt-14 border-t border-white/10 pt-10" aria-labelledby="flywheel-heading">
    <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">Protocol activity</p>
    <h2 id="flywheel-heading" className="mt-2 text-3xl font-semibold">The SolHandle Flywheel</h2>
    <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{stages.map((stage, index) => <div key={stage} className="rounded-xl border border-cyan-300/20 bg-slate-900/70 p-4"><span className="text-xs text-cyan-300">0{index + 1} →</span><p className="mt-2 font-medium text-white">{stage}</p></div>)}</div>
    <p className="mt-3 text-sm text-cyan-200">↺ Back to Mint @</p>
    <div className="mt-8 flex flex-wrap items-end justify-between gap-2"><h3 className="text-lg font-semibold">Flywheel in numbers</h3><p className="text-xs text-slate-400">{stats ? `Checked ${new Date(stats.measuredAt).toLocaleTimeString('en-GB')}` : 'Updating…'}</p></div>
    {error && <p role="alert" className="mt-4 text-rose-300">{error}</p>}
    {!stats && !error && <p className="mt-4 text-cyan-200">Loading protocol activity…</p>}
    {metrics && <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">{metrics.map(([label, value]) => <div key={label} className="rounded-xl border border-white/10 bg-slate-900/60 p-4"><strong className="block text-xl text-cyan-100 sm:text-2xl">{value}</strong><span className="mt-2 block text-xs leading-relaxed text-slate-400">{label}</span></div>)}<div className="rounded-xl border border-violet-300/25 bg-slate-900/70 p-4"><strong className="block text-xl text-violet-200 sm:text-2xl">{progress == null ? '—' : `${progress}%`}</strong><span className="mt-2 block text-xs text-slate-400">Next milestone · official progress</span></div></div>}
    {stats && <BuybackAllocation stats={stats}/>}
    <p className="mt-4 text-xs leading-relaxed text-slate-500">Primary mint revenue reflects recorded direct mint sales; marketplace volume and royalties reflect recorded native marketplace sales only. Buyback budget is an indicative proposal, not a confirmed purchase or transfer. $HANDLE purchases and burns are shown once verifiable records are available. Mint total follows the latest protocol sync.</p>
  </section>;
}