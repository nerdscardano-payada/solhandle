import { Zap } from "lucide-react";

export default function RushBanner() {
  return <div className="relative mb-6 flex items-center justify-center gap-2 rounded-xl border border-violet-300/40 bg-gradient-to-r from-violet-500/15 via-cyan-400/10 to-emerald-400/15 px-4 py-3 text-center shadow-[0_0_24px_rgba(139,92,246,.14)]"><Zap className="h-4 w-4 shrink-0 text-violet-300"/><p className="text-sm font-semibold text-white"><span className="uppercase tracking-wider text-violet-200">Rush is live</span><span className="mx-2 text-slate-500">·</span>Claim any 3+ character SolHandle for just 0.10 SOL — only 72 hours.</p></div>;
}