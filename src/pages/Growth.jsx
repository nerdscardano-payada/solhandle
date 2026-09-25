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
  useEffect(() => { let active = true; base44.functions.invoke('growthCurve', { action: 'view' }).then(r => { if (active) setData(r.data); }).catch(() => { if (active) setError('Groeigegevens zijn tijdelijk niet beschikbaar.'); }); return () => { active = false; }; }, []);
  const c = data?.cycle;
  const handles = c ? Math.min(100, Math.floor(Math.max(0, c.handles_now - c.handles_start) / c.handles_target * 100)) : 0;
  const holders = c ? Math.min(100, Math.floor(Math.max(0, c.holders_now - c.holders_start) / c.holders_target * 100)) : 0;
  const price = c?.price_start_usd ? Math.min(100, Math.floor(Math.max(0, c.price_now_usd / c.price_start_usd - 1) / (c.price_target_percent / 100) * 100)) : 0;
  const livePrice = Number(market?.priceUsd) > 0 ? Number(market.priceUsd) : null;
  const displayedPrice = livePrice ?? c?.price_now_usd;
  const displayedPriceProgress = c?.price_start_usd ? Math.min(100, Math.max(0, displayedPrice / c.price_start_usd - 1) / (c.price_target_percent / 100) * 100) : 0;
  const progress = Math.floor(handles * .4 + holders * .4 + price * .2);
  const liveProgress = Math.round((handles * .4 + holders * .4 + displayedPriceProgress * .2) * 10) / 10;
  const officialProgress = c?.max_progress ?? progress;
  const next = [20, 40, 60, 80, 100].find(n => n > officialProgress);
  return <main className="min-h-screen bg-slate-950 text-white"><div className="mx-auto min-h-screen max-w-7xl border-x border-white/10"><Header/><section className="mx-auto max-w-5xl px-5 py-12 sm:py-20">
    <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">Communitygroei · Mainnet</p>
    <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">$HANDLE × SolHandle Growth Curve</h1>
    <p className="mt-3 text-slate-400">Meer handles, meer houders en duurzame marktinteresse brengen samen de volgende beloning dichterbij.</p>
    {error ? <div role="alert" className="mt-10 text-rose-300">{error}</div> : !data ? <p className="mt-10 text-cyan-200">Geverifieerde voortgang laden…</p> : !c ? <div className="mt-10 rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-slate-300">De eerste cyclus wacht op een geverifieerde mainnet-meting.</div> : <>
      <div className="mt-10 rounded-2xl border border-cyan-300/25 bg-slate-900/70 p-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-widest text-cyan-300">Cyclus {c.cycle_number}</p><p className="mt-3 text-5xl font-semibold">{liveProgress}% <span className="text-lg text-slate-400">indicatief</span></p></div><span className="text-sm text-slate-400">{next ? `Volgende officiële beloning bij ${next}%` : 'Alle officiële mijlpalen bereikt'}</span></div><div role="progressbar" aria-label="Indicatieve totale groei" aria-valuemin={0} aria-valuemax={100} aria-valuenow={liveProgress} className="mt-6 h-3 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-400" style={{ width: `${liveProgress}%` }}/></div><p className="mt-3 text-xs text-slate-400">40% nieuwe mints + 40% nieuwe gekwalificeerde houders + 20% tokenprijs. De balk beweegt mee met de live koers; de officiële, uurlijks gemeten voortgang is {officialProgress}% en bepaalt welke mijlpalen bereikt zijn. 100% vereist alle drie.</p></div>
      <div className="mt-4 grid gap-4 md:grid-cols-3"><GrowthMeter label="Nieuwe SolHandles · 40%" current={c.handles_now} baseline={c.handles_start} target={c.handles_target} percentage={handles}/><GrowthMeter label="Nieuwe houders · 40%" current={c.holders_now} baseline={c.holders_start} target={c.holders_target} percentage={holders}/><GrowthPriceMeter start={c.price_start_usd} current={displayedPrice} targetPercent={c.price_target_percent || 150} percentage={displayedPriceProgress} source={livePrice === null ? 'snapshot' : marketStatus === 'unavailable' ? 'stale' : 'live'}/></div>
      <p className="mt-4 text-xs leading-relaxed text-slate-400">Doel deze cyclus: +{c.handles_target} betaalde mainnet-mints, +{c.holders_target} wallets met minimaal {data.minimum_balance.toLocaleString()} $HANDLE gedurende 24 uur en +{c.price_target_percent || 150}% tokenprijs ten opzichte van de eerste beschikbare prijsmeting in deze cyclus. Bestaande houders en handles vormen de nulmeting. Tokenprijs uit de meest liquide officiële Solana-pool op DEX Screener; de uurlijkse meting kan afwijken van de actuele koers. Start {new Date(c.started_at).toLocaleDateString('nl-BE')}. Groei laatst gemeten {new Date(c.last_checked_at).toLocaleString('nl-BE')}. Prijs laatst geverifieerd {new Date(c.price_checked_at || c.last_checked_at).toLocaleString('nl-BE')}.</p>
      <GrowthHowTo minimumBalance={data.minimum_balance}/><GrowthMilestones progress={officialProgress} cycle={c.cycle_number}/>
      {data.completed_cycles?.length > 0 && <div className="mt-10 border-t border-white/10 pt-6"><h2 className="text-lg font-semibold">Afgeronde cycli</h2><p className="mt-2 text-sm text-slate-400">{data.completed_cycles.map(item => `Cyclus ${item.cycle_number}`).join(' · ')} · afronding betekent niet dat beloningen al zijn uitgevoerd.</p></div>}
    </>}
  </section></div></main>;
}