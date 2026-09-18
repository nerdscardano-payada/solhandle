import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import PortfolioMarketplaceAction from "@/components/solhandle/PortfolioMarketplaceAction";
import { Image } from "@/components/ui/image";
import HandleCard from "@/components/solhandle/HandleCard";

export default function MarketOwnedHandles({ wallet, onListingChange }) {
  const [handles, setHandles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!wallet) { setHandles([]); return; }
    setLoading(true);
    base44.functions.invoke("getOwnerHandles", { wallet })
      .then((response) => setHandles(response.data.handles || []))
      .catch(() => setHandles([]))
      .finally(() => setLoading(false));
  }, [wallet]);

  return <section className="rounded-xl border border-white/10 bg-[#151a23] p-3 shadow-xl shadow-black/20 sm:p-4">
    <div className="flex items-end justify-between gap-4">
      <div><p className="text-xs font-medium uppercase tracking-[0.16em] text-cyan-300">Your portfolio</p><h2 className="mt-1 text-lg font-semibold">Owned Handles</h2></div>
      <p className="hidden text-xs text-slate-500 sm:block">List verified assets directly</p>
    </div>
    {!wallet ? <p className="mt-4 rounded-lg border border-white/10 bg-black/20 px-4 py-5 text-sm text-slate-400">Connect your wallet above to view and list your handles.</p>
      : loading ? <p className="mt-4 rounded-lg border border-white/10 bg-black/20 px-4 py-5 text-sm text-slate-400">Verifying your handles on Solana…</p>
      : !handles.length ? <p className="mt-4 rounded-lg border border-white/10 bg-black/20 px-4 py-5 text-sm text-slate-400">No verified SolHandles were found for this wallet.</p>
      : <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">{handles.map((item) => <article key={item.asset || item.handle} className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-700 via-slate-300 to-slate-700 p-3 shadow-lg shadow-black/30">
          {item.imageUri ? <Image src={item.imageUri} alt={`${item.display || `@${item.handle}`} SolHandle NFT`} className="aspect-[16/10] w-full rounded-lg border border-white/20 bg-slate-950" fittingType="fit"/> : <div className="overflow-hidden rounded-lg border border-white/20 bg-slate-950"><HandleCard handle={item.handle}/></div>}
          <div className="mt-3"><PortfolioMarketplaceAction item={item} wallet={wallet} onComplete={onListingChange} /></div>
        </article>)}</div>}
  </section>;
}