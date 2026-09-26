import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const options = [
  { title: 'New SolHandles', detail: 'Every confirmed paid mainnet mint after the cycle baseline advances this goal.', action: 'Find a handle', path: '/' },
  { title: 'Qualified holders', detail: 'One wallet counts after holding the minimum $HANDLE balance for 24 hours of consecutive measurements.', action: 'Explore $HANDLE', path: '/upcoming/token-launch' },
  { title: 'Market cap', detail: 'This is a live market signal, not a guaranteed outcome. Official milestone decisions use hourly snapshots.', action: 'Explore $HANDLE', path: '/upcoming/token-launch' }
];

export default function GrowthFocus() {
  const [active, setActive] = useState(0);
  const selected = options[active];
  return <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-slate-900/60 p-5 sm:p-6"><p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">Explore the three growth signals</p><div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Growth signals">{options.map((option, index) => <button key={option.title} type="button" onClick={() => setActive(index)} aria-pressed={active === index} className={`rounded-full border px-4 py-2 text-sm transition-colors ${index === active ? 'border-cyan-300/70 bg-cyan-300/15 text-white shadow-[0_0_24px_rgba(34,211,238,0.15)]' : 'border-white/15 text-slate-300 hover:border-cyan-300/50'}`}>{option.title}</button>)}</div><div className="mt-5 flex flex-wrap items-center justify-between gap-4" aria-live="polite"><p className="max-w-2xl text-sm leading-relaxed text-slate-300">{selected.detail}</p><Link to={selected.path} className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-white">{selected.action}<ArrowUpRight className="h-4 w-4"/></Link></div></div>;
}