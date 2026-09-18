import { Link } from "react-router-dom";
import HandleCard from "@/components/solhandle/HandleCard";
import MarketplaceAction from "@/components/solhandle/MarketplaceAction";
import { lamportsToSol } from "@/lib/marketplace";

export default function MarketplaceCard({ listing, onComplete }) {
  return <article className="group overflow-hidden rounded-xl border border-white/10 bg-[#151a23] shadow-xl shadow-black/20"><div className="border-b border-white/10 bg-[#0e131c] p-2"><HandleCard handle={listing.handle} to={`/${listing.handle}`}/></div><div className="space-y-3 p-4"><div className="flex items-end justify-between gap-3"><div className="min-w-0"><p className="text-[10px] font-medium uppercase tracking-[0.16em] text-cyan-300">Native listing</p><Link to={`/${listing.handle}`} className="mt-1 block truncate text-lg font-semibold">@{listing.handle}</Link></div><p className="shrink-0 text-base font-semibold text-white">{lamportsToSol(listing.price_lamports)} <span className="text-xs text-slate-400">SOL</span></p></div><p className="border-t border-white/10 pt-3 text-[11px] text-slate-500">5% protocol royalty · no platform fee</p><MarketplaceAction action="buy" label="Buy now" handle={listing.handle} asset={listing.asset_address} seller={listing.seller} amount={listing.price_lamports} onComplete={onComplete}/></div></article>;
}