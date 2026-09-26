import { useState } from 'react';

const fmt = value => Number(value).toLocaleString('en-US', { maximumFractionDigits: 4 });

export default function BuybackCurve({ budget }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const total = Math.max(0, Number(budget) || 0);
  const reached = Math.floor(total);
  const cycle = total - reached;
  const percent = Math.min(100, Math.max(0, cycle * 100));
  const nearing = percent >= 50;
  const pulseDuration = `${Math.max(1.4, 4.5 - (percent - 50) * .06)}s`;
  return <div className="mt-5 rounded-xl border border-cyan-300/20 bg-slate-950/60 p-4 sm:p-5">
    <div className="flex flex-wrap items-end justify-between gap-2">
      <div><p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">1 SOL buyback cycle · 10% of first mints</p><p className="mt-1 text-lg font-semibold text-white">{reached ? `${reached} × 1 SOL budget milestone${reached === 1 ? '' : 's'} reached` : 'First 1 SOL budget milestone'}</p></div>
      <span className="text-sm font-medium text-cyan-200">{fmt(cycle)} / 1 SOL toward next</span>
    </div>
    <div className="mt-5 flex items-end justify-between gap-2 text-xs font-semibold uppercase tracking-wide"><span className="text-slate-400">Cycle starts · {reached} SOL</span><span className="rounded-lg border border-violet-300/70 bg-violet-400/15 px-3 py-1.5 text-right text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.2)]">Next budget threshold ↓<strong className="block text-base leading-tight text-white">{reached + 1} SOL</strong></span></div>
    <button type="button" onClick={() => setDetailsOpen(open => !open)} aria-expanded={detailsOpen} aria-controls="buyback-progress-details" className="group relative -mx-3 mt-3 block w-[calc(100%+1.5rem)] rounded-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300" title="Show budget calculation">
      <span className="buyback-firework buyback-firework-left" aria-hidden="true" />
      <span className="buyback-firework buyback-firework-right" aria-hidden="true" />
      <span role="progressbar" aria-label="Progress to next 1 SOL proposed buyback budget milestone" aria-valuemin={0} aria-valuemax={1} aria-valuenow={cycle} className={`relative z-10 block h-9 overflow-hidden rounded-full border bg-gradient-to-r from-emerald-500/25 via-violet-500/35 to-fuchsia-700/40 transition-shadow duration-500 group-hover:shadow-[0_0_34px_rgba(167,139,250,0.4)] ${nearing ? 'border-violet-300/80 buyback-near-glow' : 'border-cyan-300/50 shadow-[0_0_24px_rgba(34,211,238,0.2)]'}`} style={nearing ? { animationDuration: pulseDuration } : undefined}>
        <span className="absolute inset-0 bg-gradient-to-r from-emerald-300/10 via-violet-400/20 to-fuchsia-500/20" aria-hidden="true"/>
        <span className="relative block h-full rounded-full bg-gradient-to-r from-emerald-400 via-violet-500 to-fuchsia-700 shadow-[0_0_24px_rgba(34,211,238,0.65)] transition-[width] duration-700 motion-reduce:transition-none" style={{ width: `${percent}%` }} aria-hidden="true"/>
        <span className="absolute inset-y-0 right-0 w-2 border-l-2 border-white bg-fuchsia-700 shadow-[0_0_22px_rgba(196,181,253,1)]" aria-hidden="true"/>
        <span className="buyback-progress-label absolute inset-0 flex items-center justify-center text-xs font-semibold tracking-wider text-white" aria-hidden="true">{Math.round(percent)}% TO NEXT 1 SOL</span>
      </span>
      <span className="buyback-finish-flag pointer-events-none absolute right-2 top-1/2 z-20 -translate-y-1/2" aria-hidden="true" />
    </button>
    <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-slate-400"><span>Tap the bar for details</span><span>{fmt(1 - cycle)} SOL to {reached + 1} SOL budget threshold</span></div>
    {detailsOpen && <p id="buyback-progress-details" className="mt-3 rounded-lg border border-cyan-300/20 bg-cyan-300/5 p-3 text-xs text-cyan-100">Recorded 10% first-mint allocation: {fmt(total)} SOL. {fmt(reached)} SOL in budget milestones reached; {fmt(cycle)} SOL toward the next 1 SOL milestone. No buyback or burn is confirmed by this calculation.</p>}
    <p className="mt-4 text-sm text-slate-300">Each additional 1 SOL in the proposed 10% budget marks another potential buyback: buy $HANDLE with 1 SOL, then burn the purchased tokens after execution.</p>
    <p className="mt-2 text-xs leading-relaxed text-slate-400">A reached threshold does not initiate a transaction or confirm a burn. This is cumulative recorded revenue, not available treasury balance; previous thresholds are not treated as completed buybacks.</p>
  </div>;
}