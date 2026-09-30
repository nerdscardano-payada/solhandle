import { formatRelativeTime } from "@/lib/protocolDisplay";

const metrics = [
  ["totalMinted", "Total handles minted"],
  ["uniqueHolders", "Unique holders"],
  ["minted24h", "Minted in last 24h"],
  ["burned24hHandle", "$HANDLE burned · last 24h"]
];

export default function ProtocolStatsCard({ stats, state }) {
  const value = (key, suffix = "") => state === "loading" ? "…" : state === "error" ? "—" : `${(stats?.[key] ?? 0).toLocaleString(undefined, (key === "mintVolume24hHandle" || key === "burned24hHandle") ? { notation: "compact", maximumFractionDigits: 2 } : key.includes("Volume") ? { maximumFractionDigits: 3 } : {})}${suffix}`;
  return <section className="card-glow flex flex-col md:col-span-6 lg:col-span-4">
    <div className="flex items-center justify-between gap-3"><h3 className="text-sm font-semibold uppercase tracking-wider">Protocol stats</h3><span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-300"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300 shadow-sm shadow-emerald-300" />Live on Solana</span></div>
    <div className="mt-5 grid grid-cols-2 gap-2">
      {metrics.map(([key, label]) => <div className="min-w-0 rounded-xl border border-white/5 bg-slate-950/60 p-3" key={key} title={key === "burned24hHandle" ? "Burned through confirmed mint payments only" : undefined}><b className="break-words text-xl font-semibold text-cyan-100">{value(key)}</b><span className="mt-1 block text-[10px] leading-tight text-slate-400">{label}</span></div>)}
    </div>
    <div className="mt-4">
      <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400"><span>Mint volume</span><span>Last 24 hours</span></div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {[["mintVolume24hSol", "SOL"], ["mintVolume24hHandle", "$HANDLE"]].map(([key, label]) => <div key={key} className="min-w-0 rounded-xl border border-white/5 bg-slate-950/60 p-3"><b className="block break-words text-xl font-semibold text-cyan-100">{value(key)}</b><span className="mt-1 block text-[10px] leading-tight text-slate-400">{label}</span></div>)}
      </div>
    </div>
    <p className="mt-auto pt-4 text-right text-[10px] text-slate-500">Updated {stats?.lastSync ? formatRelativeTime(stats.lastSync) : "when index syncs"}</p>
  </section>;
}