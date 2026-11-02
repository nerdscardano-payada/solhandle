import { useCallback, useEffect, useState } from "react";
import { useWallet } from '@solana/wallet-adapter-react';
import { useQueryClient } from '@tanstack/react-query';
import usePullToRefresh from '@/hooks/usePullToRefresh';
import PullRefreshStatus from '@/components/solhandle/PullRefreshStatus';
import { Link } from "react-router-dom";
import Header from "@/components/solhandle/Header";
import { useIsMobile } from '@/hooks/use-mobile';
import DashboardCategories from "@/components/solhandle/DashboardCategories";
import HandleList from "@/components/solhandle/HandleList";
import HandlesOnboarding from "@/components/solhandle/HandlesOnboarding";
import PortfolioSummary from "@/components/solhandle/PortfolioSummary";
import PayDashboard from "@/components/solhandle/PayDashboard";
import PayLinkGenerator from "@/components/solhandle/PayLinkGenerator";
import MyPaymentRequests from '@/components/solhandle/requests/MyPaymentRequests';
import { base44 } from "@/api/base44Client";
import PendingChainActions from '@/components/solhandle/PendingChainActions';


export default function MyHandles() {
  const isMobile = useIsMobile();
  const { publicKey } = useWallet();
  const wallet = publicKey?.toBase58() || '';
  const [category, setCategory] = useState('handles');
  const [requestsRevision, setRequestsRevision] = useState(0);
  const [handles, setHandles] = useState([]); const [primaryHandle, setPrimaryHandle] = useState(""); const [loading, setLoading] = useState(false);
  const [primaryDemo, setPrimaryDemo] = useState(() => new URLSearchParams(window.location.search).get("demo") === "primary");
  const client = useQueryClient();
  const refreshPortfolio = useCallback(async () => {
    if (!wallet) { setHandles([]); setPrimaryHandle(""); return; }
    setLoading(true); setPrimaryHandle("");
    await Promise.all([
      base44.functions.invoke("getOwnerHandles", { wallet }).then(res => setHandles(primaryDemo ? res.data.handles.map((item) => ({ ...item, isPrimary: false })) : res.data.handles)).catch(() => setHandles([])).finally(() => setLoading(false)),
      !primaryDemo && base44.functions.invoke("reverseResolveSolHandle", { address: wallet }).then(res => setPrimaryHandle(res.data.primaryHandle)).catch(() => setPrimaryHandle(""))
    ]);
  }, [wallet, primaryDemo]);
  useEffect(() => { refreshPortfolio(); }, [refreshPortfolio]);
  useEffect(() => {
    const refresh = event => { if (event.detail.wallet === wallet) refreshPortfolio(); };
    window.addEventListener('solhandle-chain-action-settled', refresh);
    return () => window.removeEventListener('solhandle-chain-action-settled', refresh);
  }, [wallet, refreshPortfolio]);
  const pull = usePullToRefresh(() => Promise.all([refreshPortfolio(), client.refetchQueries({ type: 'active' })]));
  const markPrimary = (handle) => { setPrimaryDemo(false); setHandles((current) => current.map((item) => ({ ...item, isPrimary: item.handle === handle }))); setPrimaryHandle(`@${String(handle).replace(/^@/, "")}`); };
  return <main ref={pull.ref} data-mobile-scroll-panel className="min-h-screen bg-[#050811] text-white"><PullRefreshStatus refreshing={pull.refreshing} distance={pull.distance} ready={pull.ready}/><div className="mx-auto min-h-screen max-w-7xl border-x border-white/10"><Header/><section className="px-5 py-12 md:px-9"><p className="text-sm text-cyan-300">Wallet portfolio</p><div className="mt-2 flex items-center justify-between gap-4"><h1 className="text-4xl font-semibold">My Handles</h1></div><p className="mt-3 max-w-2xl text-slate-400">Your verified SolHandle Core Assets. Ownership is checked against Solana before this portfolio is shown.</p>{category === 'handles' && (!wallet || (!loading && !handles.length)) && <HandlesOnboarding wallet={wallet}/>}<PendingChainActions wallet={wallet}/><DashboardCategories active={category} onChange={setCategory} compact={isMobile}/>{category === 'handles' && <><PortfolioSummary wallet={wallet} primaryHandle={primaryHandle} count={handles.length} loading={loading}/><HandleList handles={handles} wallet={wallet} loading={loading} onPrimarySet={markPrimary} compact={isMobile}/></>}{category === 'pay' && <><PayDashboard/>{!isMobile && <><PayLinkGenerator key={wallet} handles={handles} wallet={wallet} primaryHandle={primaryHandle} loading={loading} onCreated={() => setRequestsRevision(value => value + 1)}/><MyPaymentRequests key={wallet} revision={requestsRevision}/></>}</>}</section></div></main>;
}