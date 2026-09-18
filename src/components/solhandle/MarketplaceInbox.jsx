import { BellRing } from "lucide-react";
import MarketplaceNotificationItems from "@/components/solhandle/MarketplaceNotificationItems";

export default function MarketplaceInbox({ bids = [], sales = [], wallet, onRefresh }) {
  if (!wallet) return null;
  const count = bids.length + sales.length;
  return <section className="mt-8 overflow-hidden rounded-2xl border border-cyan-300/30 bg-gradient-to-br from-cyan-300/10 via-slate-950 to-violet-400/10 shadow-xl shadow-cyan-950/20">
    <div className="flex items-center justify-between border-b border-white/10 px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-r from-cyan-300 to-violet-400 text-slate-950"><BellRing className="h-5 w-5"/></span><div><p className="font-semibold text-white">Marketplace notifications</p><p className="text-xs text-slate-400">Incoming bids and completed sales</p></div></div>{count > 0 && <span className="rounded-full bg-cyan-300 px-3 py-1 text-xs font-bold text-slate-950">{count} new</span>}</div>
    <div className="p-5"><MarketplaceNotificationItems bids={bids} sales={sales} wallet={wallet} onRefresh={onRefresh}/></div>
  </section>;
}