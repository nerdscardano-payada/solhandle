import { useEffect, useState } from "react";
import Header from "@/components/solhandle/Header";
import HandleList from "@/components/solhandle/HandleList";
import { base44 } from "@/api/base44Client";

export default function MyHandles() {
 const [wallet,setWallet]=useState(() => localStorage.getItem("solhandle_wallet") || ""); const [handles,setHandles]=useState([]);
 useEffect(() => { if (!wallet) return; base44.functions.invoke("getOwnerHandles", { wallet }).then(res => setHandles(res.data.handles)).catch(() => setHandles([])); }, [wallet]);
 return <main className="min-h-screen bg-[#050811] text-white"><div className="mx-auto min-h-screen max-w-7xl border-x border-white/10"><Header onConnected={setWallet}/><section className="px-5 py-12 md:px-9"><p className="text-sm text-cyan-300">Wallet identity</p><h1 className="mt-2 text-4xl font-semibold">My Handles</h1><p className="mt-3 text-slate-400">Official Core Assets owned by your connected wallet, with chain state taking precedence over this index.</p><HandleList handles={handles} wallet={wallet}/></section></div></main>;
}