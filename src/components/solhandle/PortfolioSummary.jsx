import { ShieldCheck, WalletCards } from "lucide-react";
import { shortenAddress } from "@/lib/solhandle";

export default function PortfolioSummary({ wallet, count, loading }) {
  return <div className="mt-8 grid gap-4 sm:grid-cols-2">
    <div className="card-glow flex items-center gap-4"><WalletCards className="h-8 w-8 text-cyan-300" /><div><p className="text-xs uppercase tracking-wider text-slate-500">Connected wallet</p><p className="mt-1 font-mono text-sm text-white">{wallet ? shortenAddress(wallet) : "Not connected"}</p></div></div>
    <div className="card-glow flex items-center gap-4"><ShieldCheck className="h-8 w-8 text-emerald-300" /><div><p className="text-xs uppercase tracking-wider text-slate-500">Verified SolHandles</p><p className="mt-1 text-2xl font-semibold text-white">{loading ? "…" : count}</p></div></div>
  </div>;
}