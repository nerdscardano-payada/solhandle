import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import HandleCard from "@/components/solhandle/HandleCard";

const toSol = (lamports) => (Number(lamports || 0) / 1_000_000_000).toLocaleString(undefined, { maximumFractionDigits: 3 });

export default function LatestMarketplaceListings() {
  const [listings, setListings] = useState(null);

  useEffect(() => {
    let active = true;
    base44.entities.NativeListing.filter({ status: "ACTIVE" }, "-created_date", 4)
      .then((items) => active && setListings(items))
      .catch(() => active && setListings([]));
    return () => { active = false; };
  }, []);

  return <section className="mt-8 rounded-xl border border-white/10 bg-[#11161f] p-4 shadow-xl shadow-black/20">
    <div className="flex items-end justify-between gap-4">
      <div><p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">Latest added</p><h2 className="mt-1 text-xl font-semibold">Marketplace listings</h2></div>
      <Link to="/market" className="inline-flex items-center gap-1 text-sm font-medium text-cyan-200">View market <ArrowRight className="h-4 w-4"/></Link>
    </div>
    {listings === null ? <div className="mt-4 h-20 animate-pulse rounded-lg bg-white/5"/> : listings.length ? <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">{listings.map((listing) => <Link key={listing.id} to={`/market?handle=${encodeURIComponent(listing.handle)}`} className="rounded-lg border border-white/10 bg-[#0b1018] p-3 transition-colors hover:border-cyan-300/30"><div className="overflow-hidden rounded-md border border-white/10 bg-slate-950"><HandleCard handle={listing.handle}/></div><div className="mt-3 flex items-end justify-between gap-3"><span className="truncate font-semibold text-white">@{listing.handle}</span><p className="shrink-0 text-sm font-semibold text-emerald-300">{toSol(listing.price_lamports)} SOL</p></div><p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">Native listing</p></Link>)}</div> : <p className="mt-4 rounded-lg border border-dashed border-white/10 px-4 py-5 text-sm text-slate-400">No active marketplace listings yet.</p>}
  </section>;
}