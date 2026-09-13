import { ArrowRight, Sparkles } from "lucide-react";

export default function ReferralRewardExamples() {
  const examples = [
    ["Standard Handle", "0.10 SOL mint", "0.02 SOL for you", "SolHandle receives 0.08 SOL"],
    ["Premium Handle", "0.60 SOL mint", "0.12 SOL for you", "SolHandle receives 0.48 SOL"]
  ];
  return <section className="mt-12"><div className="flex items-center gap-2 text-cyan-300"><Sparkles className="h-5 w-5"/><span className="text-sm font-semibold uppercase tracking-wider">Earn per mint</span></div><h2 className="mt-2 text-3xl font-semibold">See exactly what 20% means.</h2><div className="mt-5 grid gap-4 md:grid-cols-2">{examples.map(([title, mint, reward, net]) => <article key={title} className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-300/10 to-violet-400/10 p-6"><p className="text-sm text-slate-400">{title}</p><div className="mt-4 flex flex-wrap items-center gap-3"><b className="text-lg text-white">{mint}</b><ArrowRight className="h-5 w-5 text-cyan-300"/><b className="text-xl text-emerald-300">{reward}</b></div><p className="mt-3 text-xs text-slate-500">{net} · buyer pays the normal mint price</p></article>)}</div><div className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-5 text-center"><b className="text-xl text-emerald-200">8 Standard referrals = 0.16 SOL, payout eligible</b><p className="mt-1 text-sm text-slate-400">Earn from your first confirmed referral.</p></div></section>;
}