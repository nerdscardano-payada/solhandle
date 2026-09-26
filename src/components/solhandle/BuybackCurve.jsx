const fmt = value => Number(value).toLocaleString('en-US', { maximumFractionDigits: 4 });

export default function BuybackCurve({ budget }) {
  const total = Math.max(0, Number(budget) || 0);
  const reached = Math.floor(total);
  const cycle = total - reached;
  const percent = Math.min(100, Math.max(0, cycle * 100));
  return <div className="mt-5 rounded-xl border border-cyan-300/20 bg-slate-950/60 p-4 sm:p-5">
    <div className="flex flex-wrap items-end justify-between gap-2">
      <div><p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">1 SOL buyback cycle · 10% of first mints</p><p className="mt-1 text-lg font-semibold text-white">{reached ? `${reached} × 1 SOL budget milestone${reached === 1 ? '' : 's'} reached` : 'First 1 SOL budget milestone'}</p></div>
      <span className="text-sm font-medium text-cyan-200">{fmt(cycle)} / 1 SOL toward next</span>
    </div>
    <div className="mt-5 flex items-center justify-between text-xs font-semibold uppercase tracking-wide"><span className="text-slate-400">{reached} SOL</span><span className="rounded-md border border-violet-300/50 bg-violet-400/10 px-2 py-1 text-violet-200">Next target: {reached + 1} SOL</span></div>
    <div role="progressbar" aria-label="Progress to next 1 SOL proposed buyback budget milestone" aria-valuemin={0} aria-valuemax={1} aria-valuenow={cycle} className="relative mt-3 h-5 overflow-hidden rounded-full border border-cyan-300/30 bg-slate-800">
      <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400" style={{ width: `${percent}%` }}/>
      <div className="absolute inset-y-0 right-0 w-1.5 bg-violet-200 shadow-[0_0_14px_rgba(196,181,253,0.9)]" aria-hidden="true"/>
    </div>
    <p className="mt-2 text-right text-xs text-slate-400">{fmt(1 - cycle)} SOL until next threshold</p>
    <p className="mt-4 text-sm text-slate-300">Each additional 1 SOL in the proposed 10% budget marks another potential buyback: buy $HANDLE with 1 SOL, then burn the purchased tokens after execution.</p>
    <p className="mt-2 text-xs leading-relaxed text-slate-400">A reached threshold does not initiate a transaction or confirm a burn. This is cumulative recorded revenue, not available treasury balance; previous thresholds are not treated as completed buybacks.</p>
  </div>;
}