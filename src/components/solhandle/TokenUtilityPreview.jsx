import { BadgePercent, Clock3, Coins, ShieldCheck } from "lucide-react";

const tiers = [
  { name: "Tier 1", tokens: "25,000", share: "20%" },
  { name: "Tier 2", tokens: "100,000", share: "30%" },
  { name: "Tier 3", tokens: "250,000", share: "40%" },
  { name: "Tier 4", tokens: "1,000,000", share: "50%" },
];

export default function TokenUtilityPreview() {
  return <div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{tiers.map((tier) => <article key={tier.name} className="rounded-2xl border border-violet-400/20 bg-slate-950/70 p-5"><div className="flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-wider text-violet-300">{tier.name}</span><BadgePercent className="h-4 w-4 text-cyan-300" /></div><p className="mt-5 text-2xl font-semibold text-white">{tier.share}</p><p className="mt-1 text-sm text-slate-400">Earn Network revenue share</p><div className="mt-4 border-t border-white/10 pt-3 text-xs text-slate-500"><span className="text-slate-300">{tier.tokens} $HANDLE</span> minimum</div></article>)}</div>
    <div className="mt-4 grid gap-3 md:grid-cols-3"><div className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"><Coins className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" /><div><p className="font-semibold text-white">Actual revenue received</p><p className="mt-1 text-sm text-slate-400">Shares are calculated from revenue the protocol actually receives, never from theoretical volume.</p></div></div><div className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"><Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-violet-300" /><div><p className="font-semibold text-white">24-hour qualification</p><p className="mt-1 text-sm text-slate-400">A higher balance must remain qualified for 24 hours before its upgraded tier activates.</p></div></div><div className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" /><div><p className="font-semibold text-white">Identity stays open</p><p className="mt-1 text-sm text-slate-400">Owning and resolving a SolHandle never requires $HANDLE; tokens only determine Earn Network participation.</p></div></div></div>
  </div>;
}