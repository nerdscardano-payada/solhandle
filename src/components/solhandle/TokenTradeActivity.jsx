import { Activity, CircleDashed } from "lucide-react";

export default function TokenTradeActivity({ market, status }) {
  const periods = [["5m", "m5"], ["1h", "h1"], ["6h", "h6"], ["24h", "h24"]];
  const venue = market?.dexId || "Pending";
  const phase = market?.dexId === "pumpfun" ? "Bonding curve" : market ? "DEX market" : "Pre-launch";
  return <section className="rounded-3xl border border-white/10 bg-slate-950/70 p-5"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">Market activity</p><h3 className="mt-1 font-semibold text-white">Buy / sell flow</h3></div><Activity className="h-5 w-5 text-slate-500" /></div>
    <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">{periods.map(([label, key]) => <div key={key} className="rounded-xl border border-white/5 bg-white/5 p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-2 text-sm"><span className="text-emerald-300">{market?.txns?.[key]?.buys ?? "—"} buys</span><span className="mx-1 text-slate-600">/</span><span className="text-rose-300">{market?.txns?.[key]?.sells ?? "—"} sells</span></p></div>)}</div>
    <div className="mt-4 grid gap-2 sm:grid-cols-3"><div className="rounded-xl bg-white/5 p-3"><p className="text-xs text-slate-500">Market phase</p><p className="mt-1 font-semibold text-white">{phase}</p></div><div className="rounded-xl bg-white/5 p-3"><p className="text-xs text-slate-500">Venue</p><p className="mt-1 font-semibold text-white">{venue}</p></div><div className="rounded-xl bg-white/5 p-3"><p className="text-xs text-slate-500">Data status</p><p className="mt-1 flex items-center gap-2 font-semibold text-white"><CircleDashed className="h-3.5 w-3.5 text-cyan-300" />{status}</p></div></div>
  </section>;
}