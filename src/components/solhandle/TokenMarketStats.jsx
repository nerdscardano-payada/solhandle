const compact = (value, currency = true) => value == null ? "—" : `${currency ? "$" : ""}${Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 2 }).format(Number(value))}`;

export default function TokenMarketStats({ market }) {
  const change = Number(market?.priceChange?.h24 || 0);
  const stats = [
    ["Price USD", market?.priceUsd ? `$${Number(market.priceUsd).toPrecision(5)}` : "—"],
    ["Price SOL", market?.priceNative ? Number(market.priceNative).toPrecision(5) : "—"],
    ["Market cap", compact(market?.marketCap)],
    ["Liquidity", compact(market?.liquidity?.usd)],
    ["24h volume", compact(market?.volume?.h24)],
    ["24h change", market ? `${change > 0 ? "+" : ""}${change.toFixed(2)}%` : "—"],
  ];
  return <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3 xl:grid-cols-6">{stats.map(([label, value]) => <div key={label} className="bg-slate-950/90 px-4 py-3"><p className="text-[11px] uppercase tracking-wider text-slate-500">{label}</p><p className={`mt-1 font-semibold ${label === "24h change" && market ? change >= 0 ? "text-emerald-300" : "text-rose-300" : "text-white"}`}>{value}</p></div>)}</div>;
}