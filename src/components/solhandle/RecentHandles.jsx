import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import HandleCard from "@/components/solhandle/HandleCard";

const demoHandles = ["ansem", "crypto", "hawk", "solanaking", "toly", "jupiter", "tensor", "bonk"].map(handle => ({ handle, display: `@${handle}` }));

export default function RecentHandles() {
  const [handles, setHandles] = useState(null);
  useEffect(() => { base44.functions.invoke("getRecentHandles", { limit: 8 }).then(res => setHandles(res.data.handles)).catch(() => setHandles([])); }, []);
  const showDemo = handles !== null && !handles.length;
  const cards = showDemo ? demoHandles : handles;
  return <section className="mt-12"><div className="mb-5 flex items-end justify-between"><div><p className="text-sm text-cyan-300">On-chain activity</p><h2 className="mt-1 text-2xl font-semibold text-white">Recently minted</h2></div><span className="text-xs text-slate-500">{showDemo ? "Demo artwork · not minted" : "Official SolHandle Core Assets"}</span></div>{handles === null ? <div className="card-glow text-slate-400">Loading recent mints…</div> : <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{cards.map(handle => <HandleCard key={handle.asset || handle.handle} handle={handle.handle} display={handle.display} to={`/${handle.handle}`}/>)}</div>}</section>;
}