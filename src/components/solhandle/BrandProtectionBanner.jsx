import { ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function BrandProtectionBanner() {
  return <section className="relative overflow-hidden rounded-2xl border border-cyan-300/25 bg-gradient-to-r from-cyan-950/40 via-slate-950 to-violet-950/40 p-5 shadow-xl shadow-black/20">
    <div className="absolute -right-12 top-0 h-full w-40 bg-violet-500/10 blur-3xl"/>
    <div className="relative flex h-full flex-col justify-between gap-5 sm:flex-row sm:items-center">
      <div className="flex min-w-0 items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-300/10"><ShieldCheck className="h-6 w-6 text-emerald-300"/></div><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">Fair brand protection</p><h2 className="mt-1 text-lg font-semibold text-white">Reserved names for verified organizations.</h2><p className="mt-1 text-sm text-slate-400">Protected from impersonation and available after verification.</p></div></div>
      <Link to="/protected-brands" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-cyan-200">View directory <ArrowRight className="h-4 w-4"/></Link>
    </div>
  </section>;
}