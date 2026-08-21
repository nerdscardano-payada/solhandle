import { useEffect, useState } from "react";
import Header from "@/components/solhandle/Header";
import HandleList from "@/components/solhandle/HandleList";
import PortfolioSummary from "@/components/solhandle/PortfolioSummary";
import { base44 } from "@/api/base44Client";

export default function MyHandles() {
  const [wallet, setWallet] = useState(() => localStorage.getItem("solhandle_wallet") || "");
  const [handles, setHandles] = useState([]); const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!wallet) { setHandles([]); return; }
    setLoading(true);
    base44.functions.invoke("getOwnerHandles", { wallet }).then(res => setHandles(res.data.handles)).catch(() => setHandles([])).finally(() => setLoading(false));
  }, [wallet]);
  return <main className="min-h-screen bg-[#050811] text-white"><div className="mx-auto min-h-screen max-w-7xl border-x border-white/10"><Header onConnected={setWallet}/><section className="px-5 py-12 md:px-9"><p className="text-sm text-cyan-300">Wallet portfolio</p><h1 className="mt-2 text-4xl font-semibold">My Handles</h1><p className="mt-3 max-w-2xl text-slate-400">Your verified SolHandle Core Assets. Ownership is checked against Solana before this portfolio is shown.</p><PortfolioSummary wallet={wallet} count={handles.length} loading={loading}/><HandleList handles={handles} wallet={wallet} loading={loading}/></section></div></main>;
}