import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { sol } from "@/lib/referralLevels";

export default function ReferralActivity() {
  const [items, setItems] = useState([]);
  useEffect(() => { base44.functions.invoke("referralPortal", { action: "activity" }).then((r) => setItems(r.data.items || [])).catch(() => setItems([])); }, []);
  return <section className="card-glow mt-8"><p className="text-sm text-emerald-300">Confirmed mint activity</p><h2 className="mt-2 text-2xl font-semibold">Ambassadors earning now</h2>{items.length ? <div className="mt-5 divide-y divide-white/10">{items.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 py-3 text-sm"><span><b className="text-white">{item.ambassador}</b><span className="text-slate-400"> referred {item.premium ? "a Premium mint" : `@${item.handle}`}</span></span><b className="text-emerald-300">+{sol(item.rewardLamports)}</b></div>)}</div> : <p className="mt-5 text-sm text-slate-500">Recent confirmed referral mints will appear here.</p>}</section>;
}