import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const stages = [
  { title: 'Mint @', detail: 'A confirmed first mint creates a unique identity on Solana.', action: 'Find your handle', path: '/' },
  { title: 'Use @', detail: 'Put that identity to work as your recognizable on-chain name.', action: 'Explore handles', path: '/explore' },
  { title: 'Pay / trade / share', detail: 'Use your @handle for payments or discover the native marketplace.', action: 'Explore SolHandle Pay', path: '/pay' },
  { title: 'Protocol activity', detail: 'Real recorded mints, payments and marketplace activity power these figures.', action: 'View the market', path: '/market' },
  { title: '$HANDLE rewards + buybacks', detail: 'Community milestones are tracked separately. Buyback figures are indicative budgets, not executed purchases or burns.', action: 'View Growth Curve', path: '/growth' },
  { title: 'More attention & adoption', detail: 'The loop closes when more people discover, claim and use their own @handle.', action: 'Find your handle', path: '/' }
];

export default function FlywheelStages() {
  const [active, setActive] = useState(0);
  const stage = stages[active];
  return <div className="mt-7">
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{stages.map((item, index) => <button key={item.title} type="button" onClick={() => setActive(index)} aria-pressed={active === index} className={`group rounded-2xl border p-5 text-left transition-all duration-300 motion-reduce:transition-none ${active === index ? 'border-cyan-300/70 bg-cyan-300/10 solhandle-active-glow' : 'border-white/10 bg-slate-900/70 hover:border-violet-300/50 hover:-translate-y-1 motion-reduce:hover:translate-y-0'}`}><span className="text-xs tracking-widest text-cyan-300">0{index + 1} / 06</span><span className="mt-4 flex items-center justify-between gap-3 font-medium text-white">{item.title}<ArrowUpRight className="h-4 w-4 shrink-0 text-cyan-300"/></span></button>)}</div>
    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-violet-300/30 bg-slate-900/70 p-5 shadow-[0_0_32px_rgba(167,139,250,0.10)]" aria-live="polite"><div><p className="text-xs uppercase tracking-widest text-violet-300">Explore step 0{active + 1} · ↺ back to mint</p><p className="mt-2 text-sm text-slate-200">{stage.detail}</p></div><Link to={stage.path} className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/50 px-4 py-2 text-sm font-semibold text-cyan-200 transition-colors hover:bg-cyan-300/10">{stage.action} <ArrowUpRight className="h-4 w-4"/></Link></div>
  </div>;
}