import { ArrowRight, Sparkles } from "lucide-react";

export default function ReferralRewardExamples() {
  const examples = [
    ["Referred mint", "0.10 SOL revenue", "20–50% by tier", "Premium surcharge is included"],
    ["Secondary sale", "5% royalty received", "50% of royalty", "Based on actual receipt, not quoted sale value"],
    ["$HANDLE trade", "Creator fee received", "50% of fee", "Attributed to the referred trader wallet"]
  ];
  return <section className="mt-12"><div className="flex items-center gap-2 text-cyan-300"><Sparkles className="h-5 w-5"/><span className="text-sm font-semibold uppercase tracking-wider">Three revenue channels</span></div><h2 className="mt-2 text-3xl font-semibold">Earn from activity you originate.</h2><div className="mt-5 grid gap-4 lg:grid-cols-3">{examples.map(([title, source, reward, note]) => <article key={title} className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-300/10 to-violet-400/10 p-6"><p className="text-sm text-slate-400">{title}</p><div className="mt-4 flex items-center gap-3"><b className="text-white">{source}</b><ArrowRight className="h-5 w-5 shrink-0 text-cyan-300"/><b className="text-emerald-300">{reward}</b></div><p className="mt-3 text-xs text-slate-500">{note}</p></article>)}</div><div className="mt-4 rounded-2xl border border-violet-300/20 bg-violet-300/10 p-5 text-center"><b className="text-xl text-violet-100">Pre-launch: build your network now</b><p className="mt-1 text-sm text-slate-400">Earnings and claims remain disabled until the official $HANDLE token mint is configured.</p></div></section>;
}