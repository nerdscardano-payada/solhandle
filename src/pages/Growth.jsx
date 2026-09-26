import { useEffect, useState } from 'react';
import Header from '@/components/solhandle/Header';
import GrowthMeter from '@/components/solhandle/GrowthMeter';
import GrowthMilestones from '@/components/solhandle/GrowthMilestones';
import GrowthPriceMeter from '@/components/solhandle/GrowthPriceMeter';
import GrowthHowTo from '@/components/solhandle/GrowthHowTo';
import { base44 } from '@/api/base44Client';
import useDexScreenerMarket from '@/hooks/useDexScreenerMarket';

export default function Growth() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const { market, status: marketStatus } = useDexScreenerMarket('BLoVgMLRxxhq3X5x9s7KxaNhnQeMf5Lt7MrEpBkjpump');
  useEffect(() => { let active = true; base44.functions.invoke('growthCurve', { action: 'view' }).then(r => { if (active) setData(r.data); }).catch(() => { if (active) setError('Growth data is temporarily unavailable.'); }); return () => { active = false; }; }, []);
  const c = data?.cycle;
  const handles = c ? Math.min(100, Math.floor(Math.max(0, c.handles_now - c.handles_start) / c.handles_target * 100)) : 0;
  const holders = c ? Math.min(100, Math.floor(Math.max(0, c.holders_now - c.holders_start) / c.holders_target * 100)) : 0;
  const targetCap = Number(c?.market_cap_target_usd) || 60000;
  const verifiedCap = Number(c?.market_cap_now_usd) > 0 ? Number(c.market_cap_now_usd) : null;
  const marketCap = market?.chainId === 'solana' && market?.baseToken?.address === 'BLoVgMLRxxhq3X5x9s7KxaNhnQeMf5Lt7MrEpBkjpump' && Number(market?.liquidity?.usd) >= 1000 && Number(market?.marketCap) > 0 ? Number(market.marketCap) : null;
  const displayedCap = marketCap ?? verifiedCap;
  const capProgress = displayedCap ? Math.min(100, displayedCap / targetCap * 100) : 0;
  const liveProgress = Math.round((handles * .4 + holders * .4 + capProgress * .2) * 10) / 10;
  const officialProgress = c?.market_cap_target_usd === targetCap ? (c.max_progress ?? 0) : null;
  const next = [20, 40, 60, 80, 100].find(n => n > (officialProgress ?? 0));
  return <main className="min-h-screen bg-slate-950 text-white"><div className="mx-auto min-h-screen max-w-7xl border-x border-white/10"><Header/><section className="mx-auto max-w-5xl px-5 py-12 sm:py-20">
    <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">Community growth · Mainnet</p>
    <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">$HANDLE × SolHandle Growth Curve</h1>
    <p className="mt-3 text-slate-400">More handles, more holders, and sustained market interest bring the next reward closer.</p>
    {error ? <div role="alert" className="mt-10 text-rose-300">{error}</div> : !data ? <p className="mt-10 text-cyan-200">Loading verified progress…</p> : !c ? <div className="mt-10 rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-slate-300">The first cycle is waiting for a verified mainnet measurement.</div> : <>
      <div className="mt-10 rounded-2xl border border-cyan-300/25 bg-slate-900/70 p-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-widest text-cyan-300">Cycle {c.cycle_number}</p><p className="mt-3 text-5xl font-semibold">{liveProgress}% <span className="text-lg text-slate-400">indicative</span></p></div><span className="text-sm text-slate-400">{next ? `Next official reward at ${next}%` : 'All official milestones reached'}</span></div><div role="progressbar" aria-label="Indicative overall growth" aria-valuemin={0} aria-valuemax={100} aria-valuenow={liveProgress} className="mt-6 h-4 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-400" style={{ width: `${liveProgress}%` }}/></div><p className="mt-3 text-xs text-slate-400">40% new mints + 40% new qualified holders + 20% market cap. The bar follows the live market cap; {officialProgress === null ? 'the first official measurement under the new target will arrive with the next hourly update' : `official progress, measured hourly, is ${officialProgress}% and determines which milestones have been reached`}. Reaching 100% requires all three goals.</p></div>
      <div className="mt-4 grid gap-4 md:grid-cols-3"><GrowthMeter label="New SolHandles · 40%" current={c.handles_now} baseline={c.handles_start} target={c.handles_target} percentage={handles}/><GrowthMeter label="New holders · 40%" current={c.holders_now} baseline={c.holders_start} target={c.holders_target} percentage={holders}/><GrowthPriceMeter current={displayedCap} target={targetCap} percentage={capProgress} source={marketCap === null ? 'snapshot' : marketStatus === 'unavailable' ? 'stale' : 'live'}/></div>
      <p className="mt-4 text-xs leading-relaxed text-slate-400">This cycle’s goals: +{c.handles_target} paid mainnet mints, +{c.holders_target} wallets holding at least {data.minimum_balance.toLocaleString()} $HANDLE for 24 hours, and a $60k market cap. Existing holders and handles form the baseline. Market cap (not token price) comes from the most liquid official Solana pool on DEX Screener; the hourly measurement may differ from the current market value. Started {new Date(c.started_at).toLocaleDateString('en-GB')}. Growth last measured {new Date(c.last_checked_at).toLocaleString('en-GB')}. Market cap last verified {c.market_cap_checked_at ? new Date(c.market_cap_checked_at).toLocaleString('en-GB') : 'not yet measured'}.</p>
      <GrowthHowTo minimumBalance={data.minimum_balance} targetCap={targetCap}/><GrowthMilestones progress={officialProgress ?? 0} cycle={c.cycle_number}/>
      {data.completed_cycles?.length > 0 && <div className="mt-10 border-t border-white/10 pt-6"><h2 className="text-lg font-semibold">Completed cycles</h2><p className="mt-2 text-sm text-slate-400">{data.completed_cycles.map(item => `Cycle ${item.cycle_number}`).join(' · ')} · completion does not mean rewards have already been delivered.</p></div>}
    </>}
  </section></div></main>;
}