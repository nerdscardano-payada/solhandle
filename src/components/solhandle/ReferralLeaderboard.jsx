import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { referralLevel } from "@/lib/referralLevels";

export default function ReferralLeaderboard() {
  const [leaders, setLeaders] = useState([]); useEffect(() => { base44.functions.invoke("referralPortal", { action: "leaderboard" }).then((res) => setLeaders(res.data.leaders || [])); }, []);
  return <section className="card-glow mt-8"><p className="text-sm text-violet-300">Community growth</p><h2 className="mt-2 text-2xl font-semibold text-white">Top SolHandle Ambassadors</h2>{leaders.length ? <ol className="mt-5 divide-y divide-white/10">{leaders.map((item, index) => <li key={`${item.handle}-${index}`} className="flex items-center justify-between py-3"><span className="font-semibold text-white">{index + 1}. {item.handle}</span><span className="text-sm text-slate-400">{item.referrals} mints · {referralLevel(item.referrals).name}</span></li>)}</ol> : <p className="mt-5 text-sm text-slate-500">The leaderboard starts with the first confirmed referrals.</p>}</section>;
}