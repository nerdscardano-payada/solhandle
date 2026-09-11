import Header from "@/components/solhandle/Header";
import DemoNotice from "@/components/solhandle/DemoNotice";
import MarketplaceDemoToolbar from "@/components/solhandle/MarketplaceDemoToolbar";
import MarketplaceDemoCard from "@/components/solhandle/MarketplaceDemoCard";
import MarketplaceDemoModal from "@/components/solhandle/MarketplaceDemoModal";
import useMarketplaceDemo from "@/hooks/useMarketplaceDemo";

export default function MarketplacePreview() {
  const demo = useMarketplaceDemo();
  return <main className="min-h-screen bg-[#030615] text-white"><Header /><section className="mx-auto max-w-7xl px-5 py-12 md:px-9 md:py-16">
    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><div><p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Marketplace V1 preview</p><h1 className="mt-3 text-4xl font-semibold md:text-5xl">Trade your on-chain identity</h1><p className="mt-4 max-w-2xl text-slate-300">Explore fixed-price listings, make offers and preview non-custodial settlement.</p></div><div className="grid grid-cols-3 gap-3 text-center"><div className="card-glow"><b>128</b><p className="text-xs text-slate-500">Listings</p></div><div className="card-glow"><b>42.8 SOL</b><p className="text-xs text-slate-500">Volume</p></div><div className="card-glow"><b>5%</b><p className="text-xs text-slate-500">Royalty</p></div></div></div>
    <div className="mt-8"><DemoNotice>All listings, prices and actions on this page are simulated locally and reset when you leave.</DemoNotice></div>
    {demo.message && <div className="mt-4 rounded-xl border border-emerald-300/25 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-200">{demo.message}</div>}
    <div className="mt-6"><MarketplaceDemoToolbar query={demo.query} setQuery={demo.setQuery} sort={demo.sort} setSort={demo.setSort} onList={() => demo.setDialog({ mode: "list" })} /></div>
    <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{demo.visible.map((listing) => <MarketplaceDemoCard key={listing.handle} listing={listing} onBuy={() => demo.setDialog({ mode: "buy", listing })} onOffer={() => demo.setDialog({ mode: "offer", listing })} />)}</div>
    {!demo.visible.length && <p className="py-16 text-center text-slate-400">No demo listings match your search.</p>}
    {demo.dialog && <MarketplaceDemoModal dialog={demo.dialog} onClose={() => demo.setDialog(null)} onComplete={demo.complete} />}
  </section></main>;
}