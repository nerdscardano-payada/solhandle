import { Bell } from "lucide-react";
import { sol } from "@/lib/referralLevels";

export default function ReferralNotifications({ items = [] }) {
  if (!items.length) return null;
  return <div className="mt-6 space-y-2"><h3 className="flex items-center gap-2 font-semibold text-white"><Bell className="h-4 w-4 text-cyan-300"/>Notifications</h3>{items.slice(0, 5).map((item) => <div key={item.id} className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm"><b className="text-white">{item.title}</b><span className="ml-2 text-emerald-300">{item.amount_lamports ? sol(item.amount_lamports) : ""}</span><p className="mt-1 text-slate-400">{item.message}</p></div>)}</div>;
}