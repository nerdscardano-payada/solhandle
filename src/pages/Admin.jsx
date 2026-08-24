import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import Header from "@/components/solhandle/Header";
import AdminMetrics from "@/components/solhandle/AdminMetrics";
import AdminMintTable from "@/components/solhandle/AdminMintTable";
import AdminClaimRequests from "@/components/solhandle/AdminClaimRequests";
import AdminClaimPolicies from "@/components/solhandle/AdminClaimPolicies";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

export default function Admin() {
  const { user, isLoadingAuth, navigateToLogin } = useAuth();
  const [data, setData] = useState(null); const [loading, setLoading] = useState(false);
  const loadDashboard = () => {
    setLoading(true);
    base44.functions.invoke("getAdminDashboard", {}).then((res) => setData(res.data)).finally(() => setLoading(false));
  };
  useEffect(() => { if (user?.role === "admin") loadDashboard(); }, [user?.role]);
  if (isLoadingAuth) return <main className="min-h-screen bg-[#050811]" />;
  if (!user) return <main className="min-h-screen bg-[#050811] text-white"><div className="mx-auto min-h-screen max-w-7xl border-x border-white/10"><Header/><section className="px-5 py-20 text-center"><h1 className="text-3xl font-semibold">Developer dashboard</h1><p className="mt-3 text-slate-400">Sign in with your developer account to continue.</p><button onClick={navigateToLogin} className="mt-7 rounded-lg bg-cyan-300 px-5 py-3 font-semibold text-slate-950">Sign in</button></section></div></main>;
  if (user.role !== "admin") return <main className="min-h-screen bg-[#050811] text-white"><div className="mx-auto min-h-screen max-w-7xl border-x border-white/10"><Header/><section className="px-5 py-20 text-center"><h1 className="text-3xl font-semibold">Access restricted</h1><p className="mt-3 text-slate-400">This dashboard is available to protocol administrators only.</p></section></div></main>;
  return <main className="min-h-screen bg-[#050811] text-white"><div className="mx-auto min-h-screen max-w-7xl border-x border-white/10"><Header/><section className="px-5 py-12 md:px-9"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-cyan-300">Protocol operations</p><h1 className="mt-2 text-4xl font-semibold">Developer dashboard</h1><p className="mt-3 text-slate-400">Treasury, income and on-chain claims for SolHandle.</p></div><button onClick={loadDashboard} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/40 px-4 py-2 text-sm text-cyan-200 disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh</button></div>{data ? <><AdminMetrics data={data}/><AdminClaimPolicies/><AdminClaimRequests/><AdminMintTable mints={data.recentMints}/><p className="mt-4 text-xs text-slate-500">Indexer last synced: {data.lastSync ? new Date(data.lastSync).toLocaleString() : "Not available"}</p></> : <div className="card-glow mt-8 text-slate-400">Loading protocol data…</div>}</section></div></main>;
}