import { sol } from "@/lib/referralLevels";

export default function ReferralPayoutHistory({ payouts = [] }) {
  if (!payouts.length) return null;
  return <div className="mt-6 rounded-xl border border-white/10 p-4"><h3 className="font-semibold text-white">Payout history</h3><div className="mt-3 space-y-2">{payouts.map((item, index) => <div key={`${item.signature}-${index}`} className="flex items-center justify-between border-t border-white/5 pt-2 text-sm"><span className="text-slate-400">{new Date(item.date).toLocaleDateString()} · {item.status}</span><b className="text-emerald-300">{sol(item.amountLamports)}</b></div>)}</div></div>;
}