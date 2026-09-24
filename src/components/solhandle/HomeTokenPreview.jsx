import { ArrowRight, Check, CircleDashed, Copy } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import useTokenLaunchSettings from "@/hooks/useTokenLaunchSettings";

export default function HomeTokenPreview() {
  const { tokenMint } = useTokenLaunchSettings();
  const [copied, setCopied] = useState(false);
  return <section className="relative overflow-hidden rounded-2xl border border-violet-400/20 bg-slate-950/70 p-5 shadow-xl shadow-black/20">
    <div className="absolute -right-12 top-0 h-full w-40 bg-violet-500/10 blur-3xl"/>
    <div className="relative flex h-full flex-col justify-between gap-5 sm:flex-row sm:items-center">
      <div className="flex min-w-0 items-start gap-4"><span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${tokenMint ? "animate-pulse border-emerald-300/40 bg-emerald-300/10 text-emerald-300" : "border-violet-300/25 bg-violet-300/10 text-violet-200"}`}><CircleDashed className="h-5 w-5" /></span><div><p className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] ${tokenMint ? "text-emerald-300" : "text-violet-300"}`}>$HANDLE community token · {tokenMint ? "LIVE" : "Pre-launch"}{tokenMint && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />}</p><h2 className="mt-1 text-lg font-semibold text-white">The community layer behind SolHandle.</h2><p className="mt-1 text-sm text-slate-400">Explore the launch, market and Earn Network tiers.</p>{tokenMint && <div className="mt-3 min-w-0"><p className="text-xs font-medium text-slate-400">Official $HANDLE CA</p><div className="mt-1 flex min-w-0 items-center gap-2"><code className="min-w-0 break-all text-xs text-cyan-200">{tokenMint}</code><button type="button" aria-label="Copy $HANDLE contract address" onClick={async () => { await navigator.clipboard.writeText(tokenMint); setCopied(true); }} className="shrink-0 rounded-md border border-white/15 p-1.5 text-slate-300 hover:text-white">{copied ? <Check className="h-4 w-4"/> : <Copy className="h-4 w-4"/>}</button></div></div>}</div></div>
      <Link to="/upcoming/token-launch" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-violet-200">{tokenMint ? "Trade now" : "Explore launch"} <ArrowRight className="h-4 w-4" /></Link>
    </div>
  </section>;
}