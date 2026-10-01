import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import GrowthFocus from '@/components/solhandle/GrowthFocus';
import GrowthMobileView from '@/components/solhandle/GrowthMobileView';
import Header from '@/components/solhandle/Header';
import GrowthMeter from '@/components/solhandle/GrowthMeter';
import GrowthProgressBar from '@/components/solhandle/GrowthProgressBar';
import GrowthMilestones from '@/components/solhandle/GrowthMilestones';
import GrowthPriceMeter from '@/components/solhandle/GrowthPriceMeter';
import GrowthHowTo from '@/components/solhandle/GrowthHowTo';
import GrowthGoalMascot from '@/components/solhandle/GrowthGoalMascot';
import { base44 } from '@/api/base44Client';
import useDexScreenerMarket from '@/hooks/useDexScreenerMarket';

export default function Growth() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [checkedAt, setCheckedAt] = useState(null);
  const { market, status: marketStatus } = useDexScreenerMarket('BLoVgMLRxxhq3X5x9s7KxaNhnQeMf5Lt7MrEpBkjpump');
  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const result = await base44.functions.invoke('growthCurve', { action: 'view' });
      setData(result.data);
      setCheckedAt(new Date());
      setError('');
    } catch { setError('Growth data is temporarily unavailable.'); }
    finally { setRefreshing(false); }
  }, []);
  useEffect(() => { load(); const timer = setInterval(load, 60000); return () => clearInterval(timer); }, [load]);
  const c = data?.cycle;
  const handles = c ? Math.min(100, Math.floor(Math.max(0, c.handles_now - c.handles_start) / c.handles_target * 100)) : 0;
  const verifiedNewHolders = c ? Math.max(0, c.holders_now - c.holders_start) : 0;
  const newHolders = Math.max(verifiedNewHolders, c?.holders_manual_floor || 0);
  const holders = c ? Math.min(100, Math.floor(newHolders / c.holders_target * 100)) : 0;
  const targetCap = Number(c?.market_cap_target_usd) || 60000;
  const verifiedCap = Number(c?.market_cap_now_usd) > 0 ? Number(c.market_cap_now_usd) : null;
  const marketCap = market?.chainId === 'solana' && market?.baseToken?.address === 'BLoVgMLRxxhq3X5x9s7KxaNhnQeMf5Lt7MrEpBkjpump' && Number(market?.liquidity?.usd) >= 1000 && Number(market?.marketCap) > 0 ? Number(market.marketCap) : null;
  const displayedCap = marketCap ?? verifiedCap;
  const capProgress = displayedCap ? Math.min(100, displayedCap / targetCap * 100) : 0;
  const liveProgress = Math.round((handles * .4 + holders * .4 + capProgress * .2) * 10) / 10;
  const officialProgress = c?.market_cap_target_usd === targetCap ? (c.max_progress ?? 0) : null;
  const next = [20, 40, 60, 80, 100].find(n => n > (officialProgress ?? 0));
  return <main className="min-h-screen bg-slate-950 text-white"><div className="mx-auto min-h-screen max-w-7xl border-x border-white/10"><Header/><GrowthMobileView data={data} error={error} refreshing={refreshing} checkedAt={checkedAt} load={load} cycle={c} newHolders={newHolders} handles={handles} holders={holders} marketCap={displayedCap} targetCap={targetCap} capProgress={capProgress} liveProgress={liveProgress} officialProgress={officialProgress} next={next} source={marketCap === null ? 'snapshot' : marketStatus === 'unavailable' ? 'stale' : 'live'}/><section className="mx-auto hidden max-w-6xl px-5 py-12 sm:block sm:py-20">
    <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">Community growth · Mainnet</p>
    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><h1 className="min-w-0 text-4xl font-semibold sm:text-5xl">$HANDLE × <span className="bg-gradient-to-r from-cyan-200 via-white to-violet-300 bg-clip-text text-transparent">SolHandle Growth Curve</span></h1><GrowthGoalMascot/></div>
    <p className="mt-3 text-slate-400">More handles, more holders, and sustained market interest bring the next reward closer.</p>
    <Link to="/growth/handle-mint-payments" className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cyan-300/25 bg-slate-900/60 p-4 text-sm transition-colors hover:border-cyan-300/50"><span><strong className="block text-white">Mint with $HANDLE</strong><span className="mt-1 block text-slate-400">Proposed discount and 50% token burn · In progress</span></span><span className="font-medium text-cyan-300">Learn more →</span></Link>
    <Link to="/growth/burn" className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-burn-accent/25 bg-slate-900/60 p-4 text-sm hover:border-burn-accent/50"><span><strong className="block text-burn-highlight">Burn Dashboard</strong><span className="mt-1 block text-slate-400">Recorded $HANDLE burns, sources and on-chain transaction proof</span></span><span className="font-medium text-burn-accent">View burns →</span></Link>
    <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-slate-400"><span className="inline-flex items-center gap-2 text-emerald-300"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300 motion-reduce:animate-none"/>Market checks every ~30 sec</span><span>Cycle data refreshes every minute · official snapshot hourly</span><span>{checkedAt ? `Last fetched ${checkedAt.toLocaleTimeString('en-GB')}` : 'Fetching cycle data…'}</span><button type="button" onClick={load} disabled={refreshing} className="inline-flex items-center gap-1 rounded-lg border border-cyan-300/30 px-3 py-1.5 text-cyan-200 hover:bg-cyan-300/10 disabled:opacity-50"><RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`}/>Refresh cycle</button></div>
    {error ? <div role="alert" className="mt-10 text-rose-300">{error}</div> : !data ? <p className="mt-10 text-cyan-200">Loading verified progress…</p> : !c ? <div className="mt-10 rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-slate-300">The first cycle is waiting for a verified mainnet measurement.</div> : <>
      <div className="relative mt-10 overflow-hidden rounded-3xl border border-cyan-300/40 bg-slate-900/70 p-6 solhandle-active-glow sm:p-8"><div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl"/><div className="relative"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-widest text-cyan-300">Cycle {c.cycle_number}</p><p className="mt-3 text-5xl font-semibold">{liveProgress}% <span className="text-lg text-slate-400">indicative</span></p></div><span className="text-sm text-slate-400">{next ? `Next official reward at ${next}%` : 'All official milestones reached'}</span></div><GrowthProgressBar progress={liveProgress} officialProgress={officialProgress ?? 0}/><p className="mt-3 text-xs text-slate-400">40% new mints + 40% new qualified holders + 20% market cap. The bar follows the live market cap; {officialProgress === null ? 'the first official measurement under the new target will arrive with the next hourly update' : `official progress, measured hourly, is ${officialProgress}% and determines which milestones have been reached`}. Reaching 100% requires all three goals.</p></div></div>
      <div className="mt-4 grid gap-4 md:grid-cols-3"><GrowthMeter label="New SolHandles · 40%" current={c.handles_now} baseline={c.handles_start} target={c.handles_target} percentage={handles}/><GrowthMeter label="New holders · 40%" current={c.holders_start + newHolders} baseline={c.holders_start} target={c.holders_target} percentage={holders}/><GrowthPriceMeter current={displayedCap} target={targetCap} percentage={capProgress} source={marketCap === null ? 'snapshot' : marketStatus === 'unavailable' ? 'stale' : 'live'}/></div>
      <p className="mt-4 text-xs leading-relaxed text-slate-400">This cycle’s goals: +{c.handles_target} paid mainnet mints, +{c.holders_target} wallets holding at least {data.minimum_balance.toLocaleString()} $HANDLE for 24 hours, and a $60k market cap. Handles use the cycle baseline; holders qualify after 24 hours at the current minimum. Market cap (not token price) comes from the most liquid official Solana pool on DEX Screener; the hourly measurement may differ from the current market value. Started {new Date(c.started_at).toLocaleDateString('en-GB')}. Growth last measured {new Date(c.last_checked_at).toLocaleString('en-GB')}. Market cap last verified {c.market_cap_checked_at ? new Date(c.market_cap_checked_at).toLocaleString('en-GB') : 'not yet measured'}.</p>
      <GrowthFocus/><GrowthHowTo minimumBalance={data.minimum_balance} targetCap={targetCap}/><GrowthMilestones progress={officialProgress ?? 0} cycle={c.cycle_number}/>
      {data.completed_cycles?.length > 0 && <div className="mt-10 border-t border-white/10 pt-6"><h2 className="text-lg font-semibold">Completed cycles</h2><p className="mt-2 text-sm text-slate-400">{data.completed_cycles.map(item => `Cycle ${item.cycle_number}`).join(' · ')} · completion does not mean rewards have already been delivered.</p></div>}
    </>}
  </section></div></main>;
}