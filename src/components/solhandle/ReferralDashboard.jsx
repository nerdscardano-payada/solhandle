import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import ReferralActivation from "@/components/solhandle/ReferralActivation";
import ReferralShareActions from "@/components/solhandle/ReferralShareActions";
import ReferralStats from "@/components/solhandle/ReferralStats";
import ReferralHistory from "@/components/solhandle/ReferralHistory";
import ReferralNotifications from "@/components/solhandle/ReferralNotifications";
import ReferralPayoutHistory from "@/components/solhandle/ReferralPayoutHistory";
import EarnNetworkStatus from "@/components/solhandle/EarnNetworkStatus";
import EarnRevenueStreams from "@/components/solhandle/EarnRevenueStreams";

export default function ReferralDashboard({ wallet, handles = [] }) {
  const [data, setData] = useState(null); const [loading, setLoading] = useState(false); const [message, setMessage] = useState(""); const [activationError, setActivationError] = useState("");
  const load = () => wallet && base44.functions.invoke("referralPortal", { action: "get", wallet }).then((res) => setData(res.data));
  useEffect(() => { if (wallet) load(); else setData(null); }, [wallet]);
  const activate = async (handle) => { setLoading(true); setActivationError(""); try { await base44.functions.invoke("referralPortal", { action: "activate", wallet, handle }); await load(); } catch (error) { setActivationError(error.response?.data?.error || "Handle ownership could not be verified."); } finally { setLoading(false); } };
  const payout = async () => { setLoading(true); setMessage(""); try { const res = await base44.functions.invoke("referralPortal", { action: "request_payout", wallet }); setMessage(`Payout of ${res.data.amountSol.toFixed(3)} SOL requested.`); await load(); } catch (error) { setMessage(error.response?.data?.error || "Payout request is not available."); } finally { setLoading(false); } };
  if (!wallet) return <div className="card-glow mt-8 text-center text-slate-400">Connect your Solana wallet to become an ambassador.</div>;
  if (!data) return <div className="card-glow mt-8 text-slate-400">Loading Share & Earn…</div>;
  if (!data.settings?.enabled) return <div className="card-glow mt-8 text-center text-slate-400">Share & Earn is currently paused.</div>;
  if (!data.profile) return <><ReferralActivation handles={handles} onActivate={activate} loading={loading}/>{activationError && <p className="mt-3 text-sm text-red-300">{activationError}</p>}</>;
  return <section className="card-glow mt-8"><p className="text-sm text-cyan-300">Your Earn Network Dashboard</p><h2 className="mt-2 text-2xl font-semibold text-white">Own your identity. Build your network.</h2><p className="mt-2 text-sm text-slate-400">Your first confirmed referred mint permanently links that wallet and asset to your origin handle.</p><EarnNetworkStatus settings={data.settings} profile={data.profile}/><ReferralShareActions code={data.profile.referral_code} handle={data.profile.display_handle} wallet={wallet}/><EarnRevenueStreams network={data.network}/><ReferralStats profile={data.profile} mode={data.settings.mode} minimumPayout={data.settings.minimumPayoutSol} onPayout={payout} loading={loading}/>{message && <p className="mt-3 text-sm text-cyan-200">{message}</p>}<ReferralNotifications items={data.notifications}/><ReferralHistory conversions={data.conversions}/><ReferralPayoutHistory payouts={data.payouts}/></section>;
}