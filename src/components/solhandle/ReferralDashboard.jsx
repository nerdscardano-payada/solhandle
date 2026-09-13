import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import ReferralActivation from "@/components/solhandle/ReferralActivation";
import ReferralShareActions from "@/components/solhandle/ReferralShareActions";
import ReferralStats from "@/components/solhandle/ReferralStats";
import ReferralHistory from "@/components/solhandle/ReferralHistory";
import ReferralNotifications from "@/components/solhandle/ReferralNotifications";
import ReferralPayoutHistory from "@/components/solhandle/ReferralPayoutHistory";

export default function ReferralDashboard({ wallet, handles = [] }) {
  const [data, setData] = useState(null); const [loading, setLoading] = useState(false); const [message, setMessage] = useState("");
  const load = () => wallet && base44.functions.invoke("referralPortal", { action: "get", wallet }).then((res) => setData(res.data));
  useEffect(() => { if (wallet) load(); else setData(null); }, [wallet]);
  const activate = async (handle) => { setLoading(true); await base44.functions.invoke("referralPortal", { action: "activate", wallet, handle }); await load(); setLoading(false); };
  const payout = async () => { setLoading(true); setMessage(""); try { const res = await base44.functions.invoke("referralPortal", { action: "request_payout", wallet }); setMessage(`Payout of ${res.data.amountSol.toFixed(3)} SOL requested.`); await load(); } catch (error) { setMessage(error.response?.data?.error || "Payout request is not available."); } finally { setLoading(false); } };
  if (!wallet) return <div className="card-glow mt-8 text-center text-slate-400">Connect your Solana wallet to become an ambassador.</div>;
  if (!data) return <div className="card-glow mt-8 text-slate-400">Loading Share & Earn…</div>;
  if (!data.settings?.enabled) return <div className="card-glow mt-8 text-center text-slate-400">Share & Earn is currently paused.</div>;
  if (!data.profile) return <ReferralActivation handles={handles} onActivate={activate} loading={loading}/>;
  return <section className="card-glow mt-8"><p className="text-sm text-cyan-300">Your Ambassador Dashboard</p><h2 className="mt-2 text-2xl font-semibold text-white">Share. Mint. Earn 20%.</h2><p className="mt-2 text-sm text-slate-400">Your link is ready and stays valid across the full 30-day mint journey.</p><ReferralShareActions code={data.profile.referral_code} handle={data.profile.display_handle} wallet={wallet}/><ReferralStats profile={data.profile} minimumPayout={data.settings.minimumPayoutSol} onPayout={payout} loading={loading}/>{message && <p className="mt-3 text-sm text-cyan-200">{message}</p>}<ReferralNotifications items={data.notifications}/><ReferralHistory conversions={data.conversions}/><ReferralPayoutHistory payouts={data.payouts}/></section>;
}