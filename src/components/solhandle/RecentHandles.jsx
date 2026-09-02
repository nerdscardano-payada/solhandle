import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import invokeWithRetry from "@/lib/invokeWithRetry";
import RecentHandleActivityCard from "@/components/solhandle/RecentHandleActivityCard";

export default function RecentHandles() {
  const [handles, setHandles] = useState(null);
  useEffect(() => { let active = true; const load = () => invokeWithRetry("getRecentHandles", { limit: 8 }).then(({ data }) => active && setHandles(data.handles || [])).catch(() => active && setHandles([])); load(); const timer = setInterval(load, 30000); return () => { active = false; clearInterval(timer); }; }, []);
  if (handles !== null && !handles.length) return null;
  return <section className="mt-12">
    <div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-sm text-cyan-300">On-chain activity</p><div className="mt-1 flex items-center gap-3"><h2 className="text-2xl font-semibold text-white">Recently claimed</h2><span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-300"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />Live</span></div></div><div className="text-right"><span className="block text-xs text-slate-500">Official SolHandle Core Assets</span><Link to="/explore" className="mt-2 inline-block text-sm font-medium text-cyan-200">View all handles →</Link></div></div>
    {handles === null ? <div className="card-glow text-slate-400">Loading recent mints…</div> : <div className="flex snap-x gap-4 overflow-x-auto pb-3 lg:grid lg:grid-cols-4 lg:overflow-visible">{handles.map((item) => <RecentHandleActivityCard key={item.asset || item.handle} item={item} />)}</div>}
  </section>;
}