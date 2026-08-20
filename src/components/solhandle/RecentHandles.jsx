import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import HandleNftCard from "@/components/solhandle/HandleNftCard";

export default function RecentHandles() {
  const [handles, setHandles] = useState(null);
  useEffect(() => { base44.functions.invoke("getRecentHandles", { limit: 6 }).then(res => setHandles(res.data.handles)).catch(() => setHandles([])); }, []);
  return <section className="mt-12"><div className="mb-5 flex items-end justify-between"><div><p className="text-sm text-cyan-300">On-chain activity</p><h2 className="mt-1 text-2xl font-semibold text-white">Recently minted</h2></div><span className="text-xs text-slate-500">Official SolHandle Core Assets</span></div>{handles === null ? <div className="card-glow text-slate-400">Loading recent mints…</div> : handles.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{handles.map(handle => <HandleNftCard key={handle.asset || handle.handle} handle={handle}/>)}</div> : <div className="card-glow text-slate-400">No handles have been minted yet. Your future SolHandle could be the first.</div>}</section>;
}