import { useEffect, useState } from "react";
import Header from "@/components/solhandle/Header";
import HandleList from "@/components/solhandle/HandleList";
import PortfolioSummary from "@/components/solhandle/PortfolioSummary";
import ReferralDashboard from "@/components/solhandle/ReferralDashboard";
import MarketplaceInbox from "@/components/solhandle/MarketplaceInbox";
import MarketplaceNotificationBell from "@/components/solhandle/MarketplaceNotificationBell";
import useMarketplaceNotifications from "@/hooks/useMarketplaceNotifications";
import { base44 } from "@/api/base44Client";

export default function MyHandles() {
  const [wallet, setWallet] = useState(() => localStorage.getItem("solhandle_wallet") || "");
  const [handles, setHandles] = useState([]); const [primaryHandle, setPrimaryHandle] = useState(""); const [loading, setLoading] = useState(false);
  const [primaryDemo, setPrimaryDemo] = useState(() => new URLSearchParams(window.location.search).get("demo") === "primary");
  const notifications = useMarketplaceNotifications(wallet, handles);
  useEffect(() => {
    if (!wallet) { setHandles([]); setPrimaryHandle(""); return; }
    setLoading(true); setPrimaryHandle("");
    base44.functions.invoke("getOwnerHandles", { wallet }).then(res => setHandles(primaryDemo ? res.data.handles.map((item) => ({ ...item, isPrimary: false })) : res.data.handles)).catch(() => setHandles([])).finally(() => setLoading(false));
    if (!primaryDemo) base44.functions.invoke("reverseResolveSolHandle", { address: wallet }).then(res => setPrimaryHandle(res.data.primaryHandle)).catch(() => setPrimaryHandle(""));
  }, [wallet]);
  const markPrimary = (handle) => { setPrimaryDemo(false); window.history.replaceState({}, "", window.location.pathname); setHandles((current) => current.map((item) => ({ ...item, isPrimary: item.handle === handle }))); setPrimaryHandle(`@${String(handle).replace(/^@/, "")}`); };
  return <main className="min-h-screen bg-[#050811] text-white"><div className="mx-auto min-h-screen max-w-7xl border-x border-white/10"><Header onConnected={setWallet}/><section className="px-5 py-12 md:px-9"><p className="text-sm text-cyan-300">Wallet portfolio</p><div className="mt-2 flex items-center justify-between gap-4"><h1 className="text-4xl font-semibold">My Handles</h1><MarketplaceNotificationBell wallet={wallet} bids={notifications.bids} sales={notifications.sales} onRefresh={notifications.refresh}/></div><p className="mt-3 max-w-2xl text-slate-400">Your verified SolHandle Core Assets. Ownership is checked against Solana before this portfolio is shown.</p><PortfolioSummary wallet={wallet} primaryHandle={primaryHandle} count={handles.length} loading={loading}/><MarketplaceInbox wallet={wallet} bids={notifications.bids} sales={notifications.sales} onRefresh={notifications.refresh}/><HandleList handles={handles} wallet={wallet} loading={loading} bids={notifications.bids} onNotificationsRefresh={notifications.refresh} onPrimarySet={markPrimary}/><ReferralDashboard wallet={wallet} handles={handles}/></section></div></main>;
}