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
    base44.entities.NativeListing.filter({ status: "ACTIVE" }, "-created_date", 2)
      .then((items) => active && setListings(items))
      .catch(() => active && setListings([]));
    return () => { active = false; };
  }, []);

  return <section className="rounded-xl border border-white/10 bg-[#11161f] p-4 shadow-xl shadow-black/20">
    <div className="flex items-end justify-between gap-4">
      <div><p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">Latest added</p><h2 className="mt-1 text-xl font-semibold">Marketplace listings</h2></div>
      <Link to="/market" className="inline-flex items-center gap-1 text-sm font-medium text-cyan-200">View market <ArrowRight className="h-4 w-4"/></Link>
    </div>
    {listings === null ? <div className="mt-4 h-20 animate-pulse rounded-lg bg-white/5"/> : listings.length ? <div className="mt-4 grid grid-cols-2 gap-3">{listings.map((listing) => <Link key={listing.id} to={`/market?handle=${encodeURIComponent(listing.handle)}`} className="flex h-full flex-col rounded-xl border border-cyan-300/25 bg-slate-950/80 p-3 shadow-lg shadow-cyan-950/20 transition hover:-translate-y-0.5 hover:border-violet-400/50"><div className="mb-3 flex min-w-0 items-center justify-between gap-3"><span className="truncate text-[10px] font-semibold text-cyan-100 sm:text-lg">@{listing.handle}</span><span className="hidden shrink-0 rounded-md bg-emerald-400/10 px-2 py-1 text-[10px] text-emerald-300 sm:inline">Core Asset ✓</span></div><HandleCard handle={listing.handle} className="rounded-xl border-white/5"/><div className="mt-3 flex items-end justify-between gap-3"><p className="text-[10px] uppercase tracking-wider text-slate-500">Native listing</p><p className="shrink-0 text-sm font-semibold text-emerald-300">{toSol(listing.price_lamports)} SOL</p></div></Link>)}</div> : <p className="mt-4 rounded-lg border border-dashed border-white/10 px-4 py-5 text-sm text-slate-400">No active marketplace listings yet.</p>}
  </section>;
}