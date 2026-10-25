import '@/components/solhandle/ecosystem/live/ecosystem-token.css';
import DemoNotice from "@/components/solhandle/DemoNotice";
import TokenTradingDashboard from "@/components/solhandle/TokenTradingDashboard";
import TokenAllocation from "@/components/solhandle/TokenAllocation";
import useTokenLaunchSettings from "@/hooks/useTokenLaunchSettings";

export default function TokenLaunchPreview() {
  const { tokenMint } = useTokenLaunchSettings();
  return <main className="el-token-page"><section>
    <div><div className="hidden sm:block"><DemoNotice label={tokenMint ? "Trading live." : "Launch configuration."}>{tokenMint ? "$HANDLE is live. Trade through Jupiter inside SolHandle or use the verified pump.fun route." : "Enter the official CA in the admin dashboard to activate charts and trading."}</DemoNotice></div>
      <div className="el-token-hero hidden sm:block"><div><p className="ep-eyebrow">$HANDLE community launch</p><h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">Built for the community from day one.</h1><p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">The original pump.fun launch created one billion $HANDLE: 99% allocated to the community and 1% to the protocol. Current on-chain supply can change after burns; see the live figure below. The protocol's six-month lock is a commitment, with proof still to be published.</p>
        <div className="mt-8 grid max-w-3xl grid-cols-3 gap-3"><div className="card-glow"><p className="text-xs text-slate-500">Initial supply</p><b>1B</b></div><div className="card-glow"><p className="text-xs text-slate-500">Community</p><b>99%</b></div><div className="card-glow"><p className="text-xs text-slate-500">Protocol lock</p><b>6 months</b></div></div>
      </div>
      </div>
      <TokenTradingDashboard />
      <TokenAllocation tokenMint={tokenMint} />

      <p className="mt-8 break-words text-xs leading-relaxed text-slate-500 sm:text-sm">{tokenMint ? `Official $HANDLE CA: ${tokenMint}. Always verify this address before trading.` : "The official token mint will be published here before trading is enabled."}</p>
    </div>
  </section></main>;
}