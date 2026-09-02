import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { formatMintDate, shortenWallet } from "@/lib/protocolDisplay";

export default function MyHandlesCard({ wallet, state, handles }) {
  return <section className="card-glow flex flex-col md:col-span-3">
    <div className="flex items-center justify-between"><h3 className="text-sm font-semibold uppercase tracking-wider">My Handles</h3><Link to="/my-handles" className="text-xs text-cyan-300">View all</Link></div>
    <div className="min-h-40 flex-1">
      {!wallet && <p className="mt-5 text-sm text-slate-400">Connect your wallet to view your handles.</p>}
      {wallet && state === "loading" && <p className="mt-5 text-sm text-slate-400">Loading your handles…</p>}
      {wallet && state === "error" && <p className="mt-5 text-sm text-rose-300">Handles could not be loaded.</p>}
      {wallet && state === "ready" && !handles.length && <p className="mt-5 text-sm text-slate-400">No handles found in this wallet.</p>}
      {handles.slice(0, 3).map((item, index) => <div className="mt-4 border-b border-white/5 pb-3 last:border-0" key={item.asset || item.handle}>
        <div className="flex items-center justify-between gap-3"><span className="text-lg font-semibold text-white">{item.display || `@${item.handle}`}</span>{item.isPrimary && <span className="rounded-md bg-emerald-400/10 px-2 py-1 text-[10px] font-medium text-emerald-300">Primary</span>}</div>
        <p className="mt-1 text-xs text-slate-500">{shortenWallet(wallet)}</p>
        {index === 0 && <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] uppercase tracking-wide text-slate-500"><span>Minted<b className="mt-1 block normal-case text-slate-300">{formatMintDate(item.mintedAt)}</b></span><span>Name class<b className="mt-1 block normal-case text-slate-300">{item.nameClass || item.rarity || "Standard"}</b></span></div>}
      </div>)}
    </div>
    <Link to="/my-handles" className="mt-4 flex items-center justify-between rounded-lg border border-violet-400/25 px-4 py-2.5 text-xs text-cyan-200 hover:border-violet-400/50">Manage your handles <ArrowRight className="h-4 w-4" /></Link>
  </section>;
}