import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import ReferralActivation from "@/components/solhandle/ReferralActivation";
import ReferralShareActions from "@/components/solhandle/ReferralShareActions";
import ReferralStats from "@/components/solhandle/ReferralStats";
import ReferralHistory from "@/components/solhandle/ReferralHistory";
import ReferralNotifications from "@/components/solhandle/ReferralNotifications";
import ReferralPayoutHistory from "@/components/solhandle/ReferralPayoutHistory";

export default function ReferralDashboard({ wallet, handles = [] }) {
  const [data, setData] = useState(null); const [loading, setLoading] = useState(false); const load = () => wallet && base44.functions.invoke("referralPortal", { action: "get", wallet }).then((res) => setData(res.data));
  useEffect(() => { if (wallet) load(); else setData(null); }, [wallet]);
  const activate = async (handle) => { setLoading(true); await base44.functions.invoke("referralPortal", { action: "activate", wallet, handle }); await load(); setLoading(false); };
  if (!wallet) return <div className="card-glow mt-8 text-center text-slate-400">Connect your wallet to open Share & Earn.</div>;
  if (!data) return <div className="card-glow mt-8 text-slate-400">Loading Share & Earn…</div>;
  if (!data.settings?.enabled) return <div className="card-glow mt-8 text-center text-slate-400">Share & Earn is currently paused.</div>;
  if (!data.profile) return <ReferralActivation handles={handles} onActivate={activate} loading={loading}/>;
  return <section className="card-glow mt-8"><p className="text-sm text-cyan-300">Share & Earn</p><div className="mt-2 flex flex-wrap items-start justify-between gap-5"><div><h2 className="text-2xl font-semibold text-white">Make {data.profile.display_handle} earn.</h2><p className="mt-2 text-sm text-slate-400">Earn SOL when someone completes a confirmed mint through your link.</p></div><ReferralShareActions code={data.profile.referral_code} handle={data.profile.display_handle} wallet={wallet}/></div><ReferralStats profile={data.profile} tiers={data.settings.tiers}/><ReferralNotifications items={data.notifications}/><ReferralHistory conversions={data.conversions}/><ReferralPayoutHistory payouts={data.payouts}/></section>;
}