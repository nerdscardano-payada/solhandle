import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import PortfolioMarketplaceAction from "@/components/solhandle/PortfolioMarketplaceAction";

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

  return <section className="mt-8 rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-cyan-300/10 to-violet-400/10 p-5">
    <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">Your handles</p>
    <h2 className="mt-1 text-xl font-semibold">Sell directly on SolHandle Market</h2>
    {!wallet ? <p className="mt-3 text-sm text-slate-400">Connect your wallet above to view and list your handles.</p>
      : loading ? <p className="mt-3 text-sm text-slate-400">Verifying your handles on Solana…</p>
      : !handles.length ? <p className="mt-3 text-sm text-slate-400">No verified SolHandles were found for this wallet.</p>
      : <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{handles.map((item) => <article key={item.asset || item.handle} className="rounded-xl border border-white/10 bg-slate-950/80 p-4">
          <p className="truncate text-lg font-semibold text-white">{item.display || `@${item.handle}`}</p>
          <p className="mt-1 text-xs text-emerald-300">Verified Core Asset</p>
          <div className="mt-4"><PortfolioMarketplaceAction item={item} wallet={wallet} onComplete={onListingChange} /></div>
        </article>)}</div>}
  </section>;
}