import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import ReferralActivation from "@/components/solhandle/ReferralActivation";
import ReferralShareActions from "@/components/solhandle/ReferralShareActions";
import ReferralWidgetEmbed from "@/components/solhandle/ReferralWidgetEmbed";
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
  if (!wallet) return <div className="card-glow mt-8 text-center text-slate-400">Connect your wallet using the button in the menu above. Then choose your @handle to create your referral link.</div>;
  if (!data) return <div className="card-glow mt-8 text-slate-400">Loading Share & Earn…</div>;
  if (!data.settings?.enabled) return <div className="card-glow mt-8 text-center text-slate-400">Share & Earn is currently paused.</div>;
  if (!data.profile) return <><ReferralActivation handles={handles} onActivate={activate} loading={loading}/>{activationError && <p className="mt-3 text-sm text-red-300">{activationError}</p>}</>;
  return <section className="mt-5 rounded-2xl border border-border bg-card p-4 lg:p-6">
    <h3 className="text-xl font-semibold">Your Share & Earn account</h3>
    <EarnNetworkStatus settings={data.settings} profile={data.profile}/>
    <ReferralShareActions code={data.profile.referral_code} handle={data.profile.display_handle} wallet={wallet}/>
    <ReferralWidgetEmbed code={data.profile.referral_code}/>
    <details className="mt-5 rounded-xl border border-border p-4"><summary className="cursor-pointer font-semibold">Your earnings & activity</summary>
      <ReferralStats profile={data.profile} mode={data.settings.mode} minimumPayout={data.settings.minimumPayoutSol} onPayout={payout} loading={loading}/>
      {message && <p className="mt-3 text-sm text-names-accent">{message}</p>}
      <EarnRevenueStreams network={data.network}/><ReferralNotifications items={data.notifications}/><ReferralHistory conversions={data.conversions}/><ReferralPayoutHistory payouts={data.payouts}/>
    </details>
  </section>;
}