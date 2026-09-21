import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import invokeWithRetry from "@/lib/invokeWithRetry";
import RecentHandleActivityCard from "@/components/solhandle/RecentHandleActivityCard";

export default function RecentHandles() {
  const [handles, setHandles] = useState(null);
  useEffect(() => { let active = true; const load = () => invokeWithRetry("getRecentHandles", { limit: 2 }).then(({ data }) => active && setHandles(data.handles || [])).catch(() => active && setHandles([])); load(); const timer = setInterval(load, 30000); return () => { active = false; clearInterval(timer); }; }, []);
  if (handles !== null && !handles.length) return null;
  return <section className="rounded-xl border border-white/10 bg-[#11161f] p-4 shadow-xl shadow-black/20">
    <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">On-chain activity</p><div className="mt-1 flex items-center gap-3"><h2 className="text-xl font-semibold text-white">Recently claimed</h2><span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-300"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />Live</span></div></div><Link to="/explore" className="text-sm font-medium text-cyan-200">View all handles →</Link></div>
    {handles === null ? <div className="mt-4 h-20 animate-pulse rounded-lg bg-white/5"/> : <div className="mt-4 grid grid-cols-2 gap-3">{handles.map((item) => <RecentHandleActivityCard key={item.asset || item.handle} item={item} />)}</div>}
  </section>;
}