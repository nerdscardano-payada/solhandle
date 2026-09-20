import { LockKeyhole, Users } from "lucide-react";

export default function TokenAllocation() {
  return <section className="mt-12">
    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Community-first supply</p>
    <h2 className="mt-2 text-3xl font-semibold text-white">1 billion $HANDLE. 99% for the community.</h2>
    <div className="mt-6 overflow-hidden rounded-full border border-white/10 bg-slate-900 p-1">
      <div className="flex h-5 overflow-hidden rounded-full"><div className="w-[99%] bg-gradient-to-r from-cyan-300 to-violet-400" /><div className="w-[1%] bg-amber-300" /></div>
    </div>
    <div className="mt-5 grid gap-4 md:grid-cols-2">
      <article className="rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-5"><Users className="h-5 w-5 text-cyan-300" /><p className="mt-4 text-3xl font-semibold text-white">990,000,000</p><p className="mt-1 font-semibold text-cyan-200">Community allocation · 99%</p><p className="mt-2 text-sm leading-relaxed text-slate-400">Released through the public pump.fun launch and open market participation.</p></article>
      <article className="rounded-2xl border border-amber-300/20 bg-amber-300/5 p-5"><LockKeyhole className="h-5 w-5 text-amber-300" /><p className="mt-4 text-3xl font-semibold text-white">10,000,000</p><p className="mt-1 font-semibold text-amber-200">Protocol allocation · 1%</p><p className="mt-2 text-sm leading-relaxed text-slate-400">Held by SolHandle and locked in full for a fixed six-month period. The lock proof and unlock date will be published on-chain.</p></article>
    </div>
  </section>;
}