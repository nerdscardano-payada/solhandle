import TokenLaunchTerminal from "@/components/solhandle/TokenLaunchTerminal";
import TokenMarketStats from "@/components/solhandle/TokenMarketStats";
import TokenChartPanel from "@/components/solhandle/TokenChartPanel";
import TokenTradeActivity from "@/components/solhandle/TokenTradeActivity";
import useDexScreenerMarket from "@/hooks/useDexScreenerMarket";
import { TOKEN_LAUNCH_CONFIG } from "@/lib/tokenLaunchConfig";

export default function TokenTradingDashboard() {
  const { market, status } = useDexScreenerMarket(TOKEN_LAUNCH_CONFIG.tokenMint, TOKEN_LAUNCH_CONFIG.pairAddress);
  return <section className="mt-10"><div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">$HANDLE trading desk</p><h2 className="mt-2 text-3xl font-semibold text-white">Chart, market data and trading in one screen.</h2></div><span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">DexScreener · 30s refresh</span></div>
    <TokenMarketStats market={market} />
    <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]"><TokenChartPanel market={market} status={status} /><TokenLaunchTerminal /></div>
    <div className="mt-4"><TokenTradeActivity market={market} status={status} /></div>
  </section>;
}