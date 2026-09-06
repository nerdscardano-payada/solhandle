import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutCta() {
  return <section className="px-5 pb-20 pt-6 md:px-9"><div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-2xl border border-cyan-300/25 bg-gradient-to-r from-cyan-400/10 to-violet-500/10 p-7 md:flex-row md:items-center"><div><h2 className="text-2xl font-semibold text-white">Your identity starts with a name.</h2><p className="mt-2 text-slate-400">Find your unique handle and make it yours on Solana.</p></div><Link to="/" className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-300 via-cyan-400 to-violet-500 px-5 py-3 font-semibold text-slate-950">Find a Handle <ArrowRight className="h-4 w-4"/></Link></div></section>;
}