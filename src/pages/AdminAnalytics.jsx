import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import Header from "@/components/solhandle/Header";
import AnalyticsTrafficCards from "@/components/solhandle/AnalyticsTrafficCards";
import AnalyticsFunnel from "@/components/solhandle/AnalyticsFunnel";
import AnalyticsTables from "@/components/solhandle/AnalyticsTables";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

export default function AdminAnalytics() {
  const { user, isLoadingAuth, navigateToLogin } = useAuth(); const [data, setData] = useState(null); const [loading, setLoading] = useState(false);
  const load = () => { setLoading(true); base44.functions.invoke("getAnalyticsDashboard", {}).then((res) => setData(res.data)).finally(() => setLoading(false)); };
  useEffect(() => { if (user?.role === "admin") load(); }, [user?.role]);
  if (isLoadingAuth) return <main className="min-h-screen bg-[#050811]"/>;
  if (!user) return <main className="min-h-screen bg-[#050811] text-white"><Header/><div className="px-5 py-20 text-center"><button onClick={navigateToLogin} className="rounded-lg bg-cyan-300 px-5 py-3 font-semibold text-slate-950">Sign in</button></div></main>;
  if (user.role !== "admin") return <main className="min-h-screen bg-[#050811] text-white"><Header/><div className="px-5 py-20 text-center">Access restricted</div></main>;
  return <main className="min-h-screen bg-[#050811] text-white"><div className="mx-auto min-h-screen max-w-7xl border-x border-white/10"><Header/><section className="px-5 py-12 md:px-9"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-cyan-300">Protocol intelligence</p><h1 className="mt-2 text-4xl font-semibold">Analytics</h1><p className="mt-3 text-slate-400">GA4 traffic and SolHandle conversion insights for the last 30 days.</p></div><div className="flex flex-wrap gap-3"><Link to="/admin" className="rounded-lg border border-white/15 px-4 py-2 text-sm">Dashboard</Link><Link to="/admin/referrals" className="rounded-lg border border-violet-300/40 px-4 py-2 text-sm text-violet-200">Referrals</Link><button onClick={load} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/40 px-4 py-2 text-sm text-cyan-200"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}/>Refresh</button></div></div>{data ? <><AnalyticsTrafficCards ga={data.ga} protocol={data.protocol}/><AnalyticsFunnel data={data.protocol.funnel}/><AnalyticsTables protocol={data.protocol}/></> : <div className="card-glow mt-8 text-slate-400">Loading analytics…</div>}</section></div></main>;
}