import { useState } from "react";
import { Link } from "react-router-dom";
import HandleCard from "@/components/solhandle/HandleCard";
import MarketplaceAction from "@/components/solhandle/MarketplaceAction";
import { lamportsToSol } from "@/lib/marketplace";

export default function MarketplaceCard({ listing, onComplete }) {
  const [bidPlaced, setBidPlaced] = useState(false);

  return <article className="group overflow-hidden rounded-xl border border-white/10 bg-[#151a23] shadow-xl shadow-black/20"><div className="border-b border-white/10 bg-[#0e131c] p-2"><HandleCard handle={listing.handle} to={`/${listing.handle}`}/></div><div className="space-y-3 p-4"><div className="flex items-end justify-between gap-3"><div className="min-w-0"><p className="text-[10px] font-medium uppercase tracking-[0.16em] text-cyan-300">Native listing</p><Link to={`/${listing.handle}`} className="mt-1 block truncate text-lg font-semibold">@{listing.handle}</Link></div><p className="shrink-0 rounded-lg border border-cyan-300/30 bg-gradient-to-r from-cyan-300/15 to-violet-400/15 px-3 py-2 text-xl font-bold text-cyan-200 shadow-sm shadow-cyan-950/40">{lamportsToSol(listing.price_lamports)} <span className="text-xs font-semibold text-violet-200">SOL</span></p></div><p className="border-t border-white/10 pt-3 text-[11px] text-slate-500">5% protocol royalty · no platform fee</p><div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-3"><MarketplaceAction cardLayout action="buy" label="Buy now" handle={listing.handle} asset={listing.asset_address} seller={listing.seller} amount={listing.price_lamports} onComplete={onComplete}/><MarketplaceAction cardLayout action="bid" label="Place bid" handle={listing.handle} asset={listing.asset_address} seller={listing.seller} onComplete={() => setBidPlaced(true)}/>{bidPlaced && <p className="order-4 col-span-2 text-xs text-emerald-300">Bid placed successfully.</p>}</div></div></article>;
}