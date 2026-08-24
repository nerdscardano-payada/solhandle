import { useEffect, useState } from "react";
import { CircleDollarSign, Gem, Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";

const steps=[[Search,"Search","Find the handle you want."],[CircleDollarSign,"Claim","Claim it before anyone else."],[Sparkles,"Mint","Mint your handle as an NFT."],[Gem,"Own","Your identity is yours."]];

export default function FeatureCards({ wallet }) {
  const [handles, setHandles] = useState([]);
  const [handlesState, setHandlesState] = useState("idle");
  const [stats, setStats] = useState(null);
  const [statsState, setStatsState] = useState("loading");

  useEffect(() => { let active=true; base44.functions.invoke("getProtocolStats", {}).then(({data}) => { if(active){setStats(data);setStatsState("ready");} }).catch(() => active && setStatsState("error")); return () => { active=false; }; }, []);
  useEffect(() => { let active=true; if(!wallet){setHandles([]);setHandlesState("idle");return () => { active=false; };} setHandlesState("loading"); base44.functions.invoke("getOwnerHandles", {wallet}).then(({data}) => {if(active){setHandles(data.handles || []);setHandlesState("ready");}}).catch(() => active && setHandlesState("error")); return () => {active=false;}; }, [wallet]);

  const statValue = (key) => statsState === "loading" ? "Syncing" : statsState === "error" ? "Unavailable" : (stats?.[key] ?? "—").toLocaleString();
  return <div className="grid gap-4 md:grid-cols-12"><section className="card-glow md:col-span-6"><h3>How it works</h3><div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">{steps.map(([Icon,title,text],i)=><div key={title}><Icon className="mb-3 h-8 w-8 rounded-full border border-emerald-300/40 bg-emerald-300/10 p-2 text-emerald-300"/><span className="text-xs text-emerald-300">{i+1}</span><b className="block text-sm text-white">{title}</b><p className="mt-1 text-xs leading-relaxed text-slate-400">{text}</p></div>)}</div></section><section className="card-glow md:col-span-3"><div className="flex justify-between"><h3>My Handles</h3><Link to="/my-handles" className="text-xs text-violet-300">View all</Link></div><HandleSummary wallet={wallet} state={handlesState} handles={handles}/></section><section className="card-glow md:col-span-3"><h3>Protocol stats</h3><div className="mt-4 space-y-4"><Metric label="Total handles minted" value={statValue("totalMinted")}/><Metric label="Active holders" value={statValue("activeHolders")}/><Metric label="Recent claims (24h)" value={statValue("recentClaims")}/></div></section></div>;
}

function HandleSummary({wallet,state,handles}) {
  if(!wallet) return <p className="mt-4 text-sm text-slate-400">Connect your wallet to view your handles.</p>;
  if(state === "loading") return <p className="mt-4 text-sm text-slate-400">Loading your handles…</p>;
  if(state === "error") return <p className="mt-4 text-sm text-rose-300">Handles could not be loaded.</p>;
  if(!handles.length) return <p className="mt-4 text-sm text-slate-400">No handles found in this wallet.</p>;
  return handles.slice(0,3).map((item)=><div className="mt-4 flex items-center justify-between" key={item.asset || item.handle}><span className="font-medium text-white">{item.display || `@${item.handle}`}</span>{item.isPrimary && <span className="rounded bg-emerald-400/10 px-2 text-xs text-emerald-300">Primary</span>}</div>);
}

function Metric({label,value}) { return <div className="flex justify-between gap-3 border-b border-white/5 pb-2 text-sm"><span className="text-slate-400">{label}</span><b className="text-cyan-200">{value}</b></div> }