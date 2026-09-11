import Header from "@/components/solhandle/Header";
import DemoNotice from "@/components/solhandle/DemoNotice";
import TokenTradeDemo from "@/components/solhandle/TokenTradeDemo";
import TokenUtilityPreview from "@/components/solhandle/TokenUtilityPreview";

export default function TokenLaunchPreview() {
  return <main className="min-h-screen overflow-hidden bg-[#030615] text-white"><Header /><section className="relative px-5 py-12 md:px-9 md:py-16">
    <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
    <div className="relative mx-auto max-w-6xl"><DemoNotice>This launch terminal uses sample values and local calculations. No token, pool or transaction is live.</DemoNotice>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center"><div><p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">$HANDLE launch preview</p><h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-7xl">Utility for the SolHandle economy.</h1><p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">A direct Meteora Dynamic Bonding Curve launch, presented through a branded and non-custodial SolHandle experience.</p>
        <div className="mt-8 grid grid-cols-3 gap-3"><div className="card-glow"><p className="text-xs text-slate-500">Price</p><b>0.0042 SOL</b></div><div className="card-glow"><p className="text-xs text-slate-500">Raised</p><b>256 SOL</b></div><div className="card-glow"><p className="text-xs text-slate-500">Stage</p><b>Bonding</b></div></div>
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Launch sequence</p><div className="mt-3 flex flex-wrap items-center gap-2 text-sm"><span className="text-violet-200">DBC launch</span><span className="text-slate-600">→</span><span className="text-slate-300">Price discovery</span><span className="text-slate-600">→</span><span className="text-cyan-200">Meteora DAMM liquidity</span></div></div>
      </div><TokenTradeDemo /></div>
      <div className="mt-12"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Designed for participation, not passive yield</p><h2 className="mb-5 mt-2 text-2xl font-semibold">Utility from day one</h2><TokenUtilityPreview /></div>
      <p className="mt-8 text-sm leading-relaxed text-slate-500">Planned holder benefits include reduced protocol royalties for eligible users who lock $HANDLE. Benefits will be phased in from measured marketplace activity and sustainable liquidity. No token-based fee or royalty tiers are fixed yet; final supply, curve parameters, allocations and dates remain subject to tokenomics, security and legal/MiCA review.</p>
    </div>
  </section></main>;
}