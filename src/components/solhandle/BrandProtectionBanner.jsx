import { ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function BrandProtectionBanner() {
  return <section className="relative overflow-hidden rounded-2xl border border-cyan-300/35 bg-gradient-to-r from-cyan-950/50 via-slate-950 to-violet-950/50 p-6 shadow-xl shadow-cyan-950/20 md:p-8">
    <div className="absolute -left-16 top-0 h-full w-48 bg-cyan-400/10 blur-3xl"/><div className="absolute -right-16 top-0 h-full w-48 bg-violet-500/15 blur-3xl"/>
    <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_center,transparent_0,transparent_35%,rgba(34,211,238,.12)_36%,transparent_37%),linear-gradient(155deg,transparent_48%,rgba(139,92,246,.16)_49%,transparent_50%)]"/>
    <div className="relative grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-300/40 bg-cyan-300/10 shadow-lg shadow-cyan-500/20"><ShieldCheck className="h-10 w-10 text-emerald-300"/></div>
      <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Fair brand protection</p><h2 className="mt-2 text-2xl font-semibold text-white">Reserved for the organizations that built the Solana ecosystem.</h2><p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">We protect company handles from impersonation and speculation. SolHandle never sells these reserved names to third parties: verified official channels can mint their handle free of charge after verification and approval.</p></div>
      <Link to="/protected-brands" className="inline-flex items-center justify-center gap-2 rounded-lg border border-violet-400/40 bg-violet-400/10 px-5 py-3 text-sm font-semibold text-cyan-100 hover:border-cyan-300/50">View directory <ArrowRight className="h-4 w-4"/></Link>
    </div>
  </section>;
}