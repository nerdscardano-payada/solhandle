import { ArrowRight, Gem, Search, Sparkles, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  [Search, "Search", "Find the @handle you want."],
  [Wallet, "Connect wallet", "Connect your Solana wallet."],
  [Sparkles, "Pay & mint", "Pay with SOL or $HANDLE to mint your NFT."],
  [Gem, "Own", "Your identity. Yours forever."]
];

export default function HowItWorksCard() {
  return <section className="card-glow flex flex-col md:col-span-12 lg:col-span-4">
    <h3 className="text-sm font-semibold uppercase tracking-wider text-white">How it works</h3>
    <div className="relative mt-5 grid flex-1 grid-cols-2 gap-5 sm:grid-cols-4 lg:grid-cols-2">
      <div className="absolute left-[12%] right-[12%] top-5 hidden h-px bg-gradient-to-r from-cyan-300/30 via-violet-400/50 to-emerald-300/30 sm:block lg:hidden" />
      {steps.map(([Icon, title, text], index) => <div className="relative" key={title}>
        <div className="relative z-10 mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300/50 bg-slate-950 shadow-lg shadow-cyan-500/10">
          <Icon className={`h-5 w-5 ${index === 2 ? "text-violet-300" : "text-cyan-300"}`} />
        </div>
        <span className="text-xs font-semibold text-cyan-300">{index + 1}</span>
        <b className="block text-sm text-white">{title}</b>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">{text}</p>
      </div>)}
    </div>
    <Link to="/docs" className="mt-5 flex items-center justify-between rounded-lg border border-white/10 px-4 py-2.5 text-xs text-cyan-200 hover:border-cyan-300/30">
      Learn more about SolHandle <ArrowRight className="h-4 w-4" />
    </Link>
  </section>;
}