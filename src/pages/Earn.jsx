import { useEffect, useState } from "react";
import Header from "@/components/solhandle/Header";
import ReferralDashboard from "@/components/solhandle/ReferralDashboard";
import ReferralLeaderboard from "@/components/solhandle/ReferralLeaderboard";
import ReferralExplainer from "@/components/solhandle/ReferralExplainer";
import { base44 } from "@/api/base44Client";

export default function Earn() {
  const [wallet, setWallet] = useState(() => localStorage.getItem("solhandle_wallet") || ""); const [handles, setHandles] = useState([]);
  useEffect(() => { if (wallet) base44.functions.invoke("getOwnerHandles", { wallet }).then((res) => setHandles(res.data.handles || [])).catch(() => setHandles([])); else setHandles([]); }, [wallet]);
  return <main className="min-h-screen bg-[#050811] text-white"><div className="mx-auto min-h-screen max-w-7xl border-x border-white/10"><Header onConnected={setWallet}/><section className="px-5 py-14 md:px-9"><div className="mx-auto max-w-3xl text-center"><p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">Share & Earn</p><h1 className="mt-3 text-4xl font-semibold sm:text-6xl">Own it. Share it. Earn SOL.</h1><p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">Every SolHandle holder can become an ambassador and earn up to 20% from confirmed mints.</p></div><div className="mt-10 grid gap-3 md:grid-cols-3">{[["1", "Get your link", "Connect a verified SolHandle."], ["2", "Share SolHandle", "Use X, Discord or any community."], ["3", "Earn SOL", "Rewards follow confirmed on-chain mints."]].map(([n, title, text]) => <div key={n} className="rounded-xl border border-white/10 bg-white/5 p-5"><span className="text-cyan-300">0{n}</span><h2 className="mt-3 font-semibold">{title}</h2><p className="mt-2 text-sm text-slate-400">{text}</p>{n === "1" && <div className="mt-3 text-xs"><span className="text-slate-500">Example: </span><code className="break-all font-mono text-cyan-200">solhandle.io/?ref=hawk</code></div>}</div>)}</div><ReferralExplainer/><ReferralDashboard wallet={wallet} handles={handles}/><ReferralLeaderboard/></section></div></main>;
}