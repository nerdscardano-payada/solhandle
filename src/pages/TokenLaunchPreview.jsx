import Header from "@/components/solhandle/Header";
import DemoNotice from "@/components/solhandle/DemoNotice";
import TokenTradingDashboard from "@/components/solhandle/TokenTradingDashboard";
import TokenAllocation from "@/components/solhandle/TokenAllocation";
import TokenUtilityPreview from "@/components/solhandle/TokenUtilityPreview";

export default function TokenLaunchPreview() {
  return <main className="min-h-screen overflow-hidden bg-[#030615] text-white"><Header /><section className="relative px-5 py-12 md:px-9 md:py-16">
    <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
    <div className="relative mx-auto max-w-6xl"><DemoNotice>The terminal is prepared for launch, but trading remains disabled until the official token mint and pump.fun market are verified.</DemoNotice>
      <div className="mt-10"><p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">$HANDLE community launch</p><h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">Built for the community from day one.</h1><p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">A transparent pump.fun launch with a fixed supply of one billion $HANDLE. SolHandle retains only 1%, locked for six months; the remaining 99% is allocated to the community.</p>
        <div className="mt-8 grid max-w-3xl grid-cols-3 gap-3"><div className="card-glow"><p className="text-xs text-slate-500">Total supply</p><b>1B</b></div><div className="card-glow"><p className="text-xs text-slate-500">Community</p><b>99%</b></div><div className="card-glow"><p className="text-xs text-slate-500">Protocol lock</p><b>6 months</b></div></div>
      </div>
      <TokenTradingDashboard />
      <TokenAllocation />
      <div className="mt-12"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Designed for participation, not passive yield</p><h2 className="mb-5 mt-2 text-2xl font-semibold">Utility from day one</h2><TokenUtilityPreview /></div>
      <p className="mt-8 text-sm leading-relaxed text-slate-500">The token mint, launch date, market parameters, lock address and on-chain proof will be published before trading is enabled. Planned utility remains subject to security, sustainability and legal review.</p>
    </div>
  </section></main>;
}