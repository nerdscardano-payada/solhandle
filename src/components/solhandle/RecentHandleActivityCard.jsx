import { BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";
import HandleCard from "@/components/solhandle/HandleCard";
import { formatRelativeTime, shortenWallet } from "@/lib/protocolDisplay";

export default function RecentHandleActivityCard({ item }) {
  const price = Number(item.priceLamports || 0) / 1_000_000_000;
  return <Link to={`/${item.handle}`} className="group block min-w-0 rounded-xl border border-cyan-300/25 bg-slate-950/80 p-1.5 shadow-lg shadow-cyan-950/20 transition hover:-translate-y-0.5 hover:border-violet-400/50 sm:rounded-2xl sm:p-3">
    <div className="mb-1.5 min-w-0 sm:mb-3 sm:flex sm:items-center sm:justify-between sm:gap-3"><h3 className="truncate text-[10px] font-semibold text-cyan-100 sm:text-lg">{item.display || `@${item.handle}`}</h3><span className="hidden rounded-md bg-emerald-400/10 px-2 py-1 text-[10px] text-emerald-300 sm:inline">Core Asset ✓</span></div>
    <HandleCard handle={item.handle} display={item.display} className="rounded-lg border-white/5 sm:rounded-xl" />
    <div className="mt-3 hidden grid-cols-2 gap-2 text-xs sm:grid">
      <span className="text-slate-400">{item.nameClass || item.rarity || "Standard"}</span><span className="text-right font-medium text-white">{price.toLocaleString(undefined, { maximumFractionDigits: 3 })} SOL</span>
      <span className="text-slate-400">Claimed {formatRelativeTime(item.mintedAt)}</span><span className="text-right text-slate-400">Owner {shortenWallet(item.owner)}</span>
    </div>
    <div className="mt-3 hidden items-center gap-1.5 border-t border-white/5 pt-3 text-[10px] text-cyan-300 sm:flex"><BadgeCheck className="h-3.5 w-3.5" />Metaplex Core</div>
  </Link>;
}