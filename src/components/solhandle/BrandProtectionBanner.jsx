import { ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function BrandProtectionBanner() {
  return <section className="relative overflow-hidden rounded-2xl border border-cyan-300/30 bg-gradient-to-br from-cyan-300/10 via-slate-950 to-violet-400/10 p-6 shadow-xl shadow-cyan-950/20 md:p-8">
    <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-violet-400/10 blur-3xl"/>
    <div className="relative grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-300/30 bg-emerald-300/10"><ShieldCheck className="h-7 w-7 text-emerald-300"/></div>
      <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Fair brand protection</p><h2 className="mt-2 text-2xl font-semibold text-white">Reserved for the organizations that built the Solana ecosystem.</h2><p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">We protect company handles from impersonation and speculation. SolHandle never sells these reserved names to third parties: verified official channels can mint their handle free of charge after verification and approval.</p></div>
      <Link to="/protected-brands" className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-100 hover:bg-cyan-300/15">View directory <ArrowRight className="h-4 w-4"/></Link>
    </div>
  </section>;
}