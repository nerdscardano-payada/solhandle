import MarketplaceAction from "@/components/solhandle/MarketplaceAction";
import { lamportsToSol } from "@/lib/marketplace";

export default function MarketplaceNotificationItems({ bids = [], sales = [], wallet, onRefresh }) {
  if (!bids.length && !sales.length) return <p className="py-3 text-sm text-slate-400">No marketplace notifications.</p>;
  return <div className="space-y-3">
    {bids.map((bid) => <div key={bid.id} className="rounded-xl border border-cyan-300/20 bg-slate-950/90 p-3">
      <div className="mb-3 flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">New bid</p><p className="mt-1 font-semibold text-white">@{bid.handle}</p></div><strong className="text-cyan-200">{lamportsToSol(bid.amount_lamports)} SOL</strong></div>
      <p className="mb-3 text-xs text-slate-500">From {bid.bidder.slice(0, 4)}…{bid.bidder.slice(-4)}</p>
      <MarketplaceAction action="accept_bid" label="Accept bid" handle={bid.handle} asset={bid.asset_address} seller={wallet} bidder={bid.bidder} amount={bid.amount_lamports} onComplete={onRefresh}/>
    </div>)}
    {sales.map((sale) => <div key={sale.id} className="rounded-xl border border-emerald-300/20 bg-emerald-400/5 p-3"><p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Handle sold</p><div className="mt-1 flex justify-between gap-3"><strong className="text-white">@{sale.handle}</strong><span className="font-semibold text-emerald-200">{lamportsToSol(sale.price_lamports)} SOL</span></div></div>)}
  </div>;
}