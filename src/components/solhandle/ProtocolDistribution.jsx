import { useEffect, useState } from "react";
import invokeWithRetry from "@/lib/invokeWithRetry";

const scarcityLabels = [["one", "1 char", 36], ["two", "2 chars", 1296], ["three", "3 chars", 46656], ["four", "4 chars", 1679616], ["long", "5–20 chars", null]];
const rarityLabels = [["legendary", "Legendary"], ["ultraRare", "Ultra Rare"], ["rare", "Rare"], ["uncommon", "Uncommon"], ["standard", "Standard"]];

export default function ProtocolDistribution() {
  const [stats, setStats] = useState(null);
  useEffect(() => { let active = true; const load = () => invokeWithRetry("getProtocolStats", {}).then(({ data }) => active && setStats(data)).catch(() => {}); load(); const timer = setInterval(load, 60000); return () => { active = false; clearInterval(timer); }; }, []);
  return <section className="mt-6 grid gap-4 md:grid-cols-2">
    <div className="card-glow"><h2 className="text-lg font-semibold text-white">Handle scarcity</h2><div className="mt-4 space-y-3">{scarcityLabels.map(([key, label, supply]) => { const count = stats?.scarcity?.[key] ?? 0; const width = supply ? Math.max(1, count / supply * 100) : 0; return <div key={key}><div className="flex justify-between text-xs"><span className="text-slate-300">{label}</span><b className="text-cyan-200">{count.toLocaleString()}{supply ? ` / ${supply.toLocaleString()} claimed` : " claimed"}</b></div>{supply && <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400" style={{ width: `${width}%` }} /></div>}</div>; })}</div></div>
    <div className="card-glow"><h2 className="text-lg font-semibold text-white">Rarity distribution</h2><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5 md:grid-cols-2 lg:grid-cols-5">{rarityLabels.map(([key, label]) => <div className="rounded-xl border border-white/5 bg-slate-950/60 p-3" key={key}><b className="text-xl text-violet-200">{(stats?.rarityDistribution?.[key] ?? 0).toLocaleString()}</b><span className="mt-1 block text-[10px] text-slate-400">{label}</span></div>)}</div></div>
  </section>;
}