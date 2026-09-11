import { Tag } from "lucide-react";

export default function MarketplaceDemoCard({ listing, onBuy, onOffer }) {
  return <article className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-xl shadow-black/20">
    <div className="flex items-center justify-between"><span className="rounded-full border border-violet-400/25 bg-violet-400/10 px-2.5 py-1 text-[11px] font-semibold text-violet-200">{listing.rarity}</span><Tag className="h-4 w-4 text-slate-500" /></div>
    <div className="my-8 text-center"><p className="text-3xl font-semibold tracking-tight text-white">{listing.handle}</p><p className="mt-2 text-xs text-slate-500">Seller {listing.seller}</p></div>
    <div className="flex items-end justify-between border-t border-white/10 pt-4"><div><p className="text-xs text-slate-500">Buy now</p><p className="mt-1 font-semibold text-white">{listing.price} SOL</p></div><div className="flex gap-2"><button onClick={onOffer} className="rounded-xl border border-white/15 px-3 py-2 text-xs text-slate-200">Offer</button><button onClick={onBuy} className="rounded-xl bg-cyan-300 px-3 py-2 text-xs font-semibold text-slate-950">Buy</button></div></div>
  </article>;
}