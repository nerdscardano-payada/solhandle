import { Link } from "react-router-dom";
import Header from "@/components/solhandle/Header";
import DemoNotice from "@/components/solhandle/DemoNotice";
import TokenTradingDashboard from "@/components/solhandle/TokenTradingDashboard";
import TokenAllocation from "@/components/solhandle/TokenAllocation";
import TokenUtilityPreview from "@/components/solhandle/TokenUtilityPreview";
import useTokenLaunchSettings from "@/hooks/useTokenLaunchSettings";

export default function TokenLaunchPreview() {
  const { tokenMint } = useTokenLaunchSettings();
  return <main className="min-h-screen overflow-hidden bg-platform text-white"><div className="mx-auto min-h-screen max-w-7xl border-x border-white/10"><Header /><section className="relative px-5 py-12 md:px-9 md:py-16">
    <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
    <div className="relative"><DemoNotice label={tokenMint ? "Trading live." : "Launch configuration."}>{tokenMint ? "$HANDLE is live. Trade through Jupiter inside SolHandle or use the verified pump.fun route." : "Enter the official CA in the admin dashboard to activate charts and trading."}</DemoNotice>
      <div className="mt-10"><p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">$HANDLE community launch</p><h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">Built for the community from day one.</h1><p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">A transparent pump.fun launch with a fixed supply of one billion $HANDLE. SolHandle retains only 1%, locked for six months; the remaining 99% is allocated to the community.</p>
        <div className="mt-8 grid max-w-3xl grid-cols-3 gap-3"><div className="card-glow"><p className="text-xs text-slate-500">Total supply</p><b>1B</b></div><div className="card-glow"><p className="text-xs text-slate-500">Community</p><b>99%</b></div><div className="card-glow"><p className="text-xs text-slate-500">Protocol lock</p><b>6 months</b></div></div>
      </div>
      <TokenTradingDashboard />
      <TokenAllocation />
      <div className="mt-12"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">Confirmed $HANDLE utility</p><div className="mt-2 flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-2xl font-semibold">Earn Network tiers from day one</h2><p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">Hold $HANDLE to qualify for a larger share of the revenue generated through your permanent referral network.</p></div><Link to="/earn" className="rounded-xl bg-gradient-to-r from-violet-400 to-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950">Explore Earn Network</Link></div><div className="mt-5"><TokenUtilityPreview /></div></div>
      <p className="mt-8 text-sm leading-relaxed text-slate-500">{tokenMint ? `Official $HANDLE CA: ${tokenMint}. Always verify this address before trading.` : "The official token mint will be published here before trading is enabled."} Earn Network percentages apply only to verified, eligible revenue and remain subject to the published program terms.</p>
    </div>
  </section></div></main>;
}