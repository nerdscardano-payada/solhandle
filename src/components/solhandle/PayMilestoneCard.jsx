import { ArrowRight, Send } from "lucide-react";
import { Link } from "react-router-dom";

export default function PayMilestoneCard() {
  return <section className="mt-4 rounded-2xl border border-cyan-300/50 bg-slate-950/85 p-5 shadow-xl shadow-cyan-400/10 lg:flex-1">
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-300"><Send className="h-4 w-4"/> Now live on Mainnet</div>
    <h2 className="mt-3 text-xl font-semibold text-white">SolHandle Pay</h2>
    <p className="mt-2 text-sm leading-relaxed text-slate-300">Send SOL directly to an @handle. Verified on-chain, signed by your wallet, with no SolHandle fee.</p>
    <Link to="/pay" className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-300 py-3 font-semibold text-slate-950 hover:bg-cyan-200">Send SOL to an @handle <ArrowRight className="h-4 w-4"/></Link>
  </section>;
}