import { ArrowRight, CircleDashed } from "lucide-react";
import { Link } from "react-router-dom";
import useTokenLaunchSettings from "@/hooks/useTokenLaunchSettings";

export default function HomeTokenPreview() {
  const { tokenMint } = useTokenLaunchSettings();
  return <section className="relative overflow-hidden rounded-2xl border border-violet-400/20 bg-slate-950/70 p-5 shadow-xl shadow-black/20">
    <div className="absolute -right-12 top-0 h-full w-40 bg-violet-500/10 blur-3xl"/>
    <div className="relative flex h-full flex-col justify-between gap-5 sm:flex-row sm:items-center">
      <div className="flex min-w-0 items-start gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-300/25 bg-violet-300/10 text-violet-200"><CircleDashed className="h-5 w-5" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">$HANDLE community token · {tokenMint ? "Live" : "Pre-launch"}</p><h2 className="mt-1 text-lg font-semibold text-white">The community layer behind SolHandle.</h2><p className="mt-1 text-sm text-slate-400">Explore the launch, market and Earn Network tiers.</p></div></div>
      <Link to="/upcoming/token-launch" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-violet-200">{tokenMint ? "Trade now" : "Explore launch"} <ArrowRight className="h-4 w-4" /></Link>
    </div>
  </section>;
}