import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { lamportsToSol } from "@/lib/solhandle";

const tierClass = { "S+": "border-violet-300/40 bg-violet-300/10 text-violet-200", S: "border-cyan-300/40 bg-cyan-300/10 text-cyan-200", A: "border-emerald-300/40 bg-emerald-300/10 text-emerald-200", B: "border-white/15 bg-white/5 text-slate-300" };

export default function PremiumDirectoryCard({ item }) {
  return <article className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 shadow-lg shadow-black/20">
    <div className="flex items-start justify-between gap-3"><div><p className="text-xs text-slate-500">Rank #{item.rank}</p><h3 className="mt-1 text-2xl font-semibold text-white">{item.display}</h3></div><span className={`rounded-md border px-2 py-1 text-xs font-bold ${tierClass[item.tier]}`}>{item.tier}</span></div>
    <div className="mt-4 flex items-center justify-between text-sm"><span className="text-emerald-300">Available</span><strong className="text-white">{lamportsToSol(item.priceLamports)} SOL</strong></div>
    <p className="mt-3 text-xs font-medium text-cyan-200">{item.category} · Score {item.score}</p><p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">{item.reason}</p>
    <Link to={`/?claim=${item.handle}`} className="mt-5 flex items-center justify-between rounded-lg bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-400 px-4 py-2.5 text-sm font-semibold text-slate-950"><span>Mint {item.display}</span><ArrowRight className="h-4 w-4"/></Link>
  </article>;
}