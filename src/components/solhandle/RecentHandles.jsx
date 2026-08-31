import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import invokeWithRetry from "@/lib/invokeWithRetry";
import HandleCard from "@/components/solhandle/HandleCard";

export default function RecentHandles() {
  const [handles, setHandles] = useState(null);
  useEffect(() => { invokeWithRetry("getRecentHandles", { limit: 8 }).then(res => setHandles(res.data.handles)).catch(() => setHandles([])); }, []);
  if (handles !== null && !handles.length) return null;
  return <section className="mt-12"><div className="mb-5 flex items-end justify-between"><div><p className="text-sm text-cyan-300">On-chain activity</p><h2 className="mt-1 text-2xl font-semibold text-white">Recently claimed</h2></div><div className="text-right"><span className="block text-xs text-slate-500">Official SolHandle Core Assets</span><Link to="/explore" className="mt-2 inline-block text-sm font-medium text-cyan-200">View all handles →</Link></div></div>{handles === null ? <div className="card-glow text-slate-400">Loading recent mints…</div> : <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{handles.map(handle => <HandleCard key={handle.asset || handle.handle} handle={handle.handle} display={handle.display} to={`/${handle.handle}`}/>)}</div>}</section>;
}