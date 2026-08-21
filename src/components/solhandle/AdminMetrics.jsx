import { Coins, Landmark, ShieldCheck, Tags } from "lucide-react";

const sol = (lamports) => lamports === null || lamports === undefined ? "—" : `${(lamports / 1_000_000_000).toFixed(3)} SOL`;

export default function AdminMetrics({ data }) {
  const metrics = [
    [Landmark, "Treasury balance", sol(data.treasuryLamports), "Live on Solana"],
    [Coins, "Indexed revenue", sol(data.indexedRevenueLamports), "Confirmed mints"],
    [Tags, "Total minted", data.totalMinted ?? "—", "Protocol collection"],
    [ShieldCheck, "Protocol state", data.paused ? "Paused" : "Live", "Current configuration"]
  ];
  return <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(([Icon, label, value, detail]) => <div key={label} className="card-glow"><Icon className="h-5 w-5 text-cyan-300" /><p className="mt-5 text-xs uppercase tracking-wider text-slate-500">{label}</p><p className="mt-1 text-2xl font-semibold text-white">{value}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div>)}</div>;
}