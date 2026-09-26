const fmt = value => Number(value).toLocaleString('en-US', { maximumFractionDigits: 4 });

export default function BuybackCurve({ budget }) {
  const total = Math.max(0, Number(budget) || 0);
  const reached = Math.floor(total);
  const cycle = total - reached;
  const percent = Math.min(100, Math.max(0, cycle * 100));
  const x = 12 + percent * 2.76;
  const y = 86 - percent * .65;
  return <div className="mt-5 rounded-xl border border-cyan-300/20 bg-slate-950/60 p-4 sm:p-5">
    <div className="flex flex-wrap items-end justify-between gap-2">
      <div><p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">1 SOL buyback cycle · 10% of first mints</p><p className="mt-1 text-lg font-semibold text-white">{reached ? `${reached} × 1 SOL budget milestone${reached === 1 ? '' : 's'} reached` : 'First 1 SOL budget milestone'}</p></div>
      <span className="text-sm font-medium text-cyan-200">{fmt(cycle)} / 1 SOL toward next</span>
    </div>
    <svg viewBox="0 0 300 110" role="img" aria-label={`${fmt(cycle)} of 1 SOL toward next proposed buyback budget milestone`} className="mt-4 h-28 w-full" preserveAspectRatio="none">
      <defs><linearGradient id="buyback-curve-fill" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#22d3ee" stopOpacity="0.07"/><stop offset="1" stopColor="#a78bfa" stopOpacity="0.3"/></linearGradient></defs>
      <path d="M12 86 Q150 82 288 21" fill="none" stroke="#64748b" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="5 6"/>
      <path d={`M12 86 Q${12 + (x - 12) / 2} 84 ${x} ${y} L${x} 98 L12 98 Z`} fill="url(#buyback-curve-fill)"/>
      <path d={`M12 86 Q${12 + (x - 12) / 2} 84 ${x} ${y}`} fill="none" stroke="#67e8f9" strokeWidth="3" strokeLinecap="round"/>
      <circle cx={x} cy={y} r="5" fill="#a78bfa" stroke="#e9d5ff" strokeWidth="2"/>
    </svg>
    <div className="flex justify-between text-xs text-slate-400"><span>{reached} SOL threshold</span><span>{reached + 1} SOL threshold</span></div>
    <p className="mt-4 text-sm text-slate-300">Each additional 1 SOL in the proposed 10% budget marks another potential buyback: buy $HANDLE with 1 SOL, then burn the purchased tokens after execution.</p>
    <p className="mt-2 text-xs leading-relaxed text-slate-400">A reached threshold does not initiate a transaction or confirm a burn. This is cumulative recorded revenue, not available treasury balance; previous thresholds are not treated as completed buybacks.</p>
  </div>;
}