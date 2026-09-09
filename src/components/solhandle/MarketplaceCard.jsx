import { Link } from "react-router-dom";
import HandleCard from "@/components/solhandle/HandleCard";
import MarketplaceAction from "@/components/solhandle/MarketplaceAction";
import { lamportsToSol } from "@/lib/marketplace";

export default function MarketplaceCard({ listing, onComplete }) {
  return <article className="overflow-hidden rounded-2xl border border-cyan-300/20 bg-slate-950 shadow-xl shadow-cyan-950/20"><HandleCard handle={listing.handle} to={`/${listing.handle}`}/><div className="space-y-4 p-5"><div className="flex items-end justify-between gap-3"><div><p className="text-xs uppercase tracking-wider text-cyan-300">Native listing</p><Link to={`/${listing.handle}`} className="mt-1 block text-xl font-semibold">@{listing.handle}</Link></div><p className="text-lg font-semibold text-emerald-300">{lamportsToSol(listing.price_lamports)} SOL</p></div><p className="text-xs text-slate-500">5% protocol royalty · no platform fee</p><MarketplaceAction action="buy" label="Buy now" handle={listing.handle} asset={listing.asset_address} seller={listing.seller} amount={listing.price_lamports} onComplete={onComplete}/></div></article>;
}