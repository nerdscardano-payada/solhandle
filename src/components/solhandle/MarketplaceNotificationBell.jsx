import { useState } from "react";
import { Bell } from "lucide-react";
import MarketplaceNotificationItems from "@/components/solhandle/MarketplaceNotificationItems";

export default function MarketplaceNotificationBell({ bids = [], sales = [], wallet, onRefresh, inline = false, compact = false }) {
  const [open, setOpen] = useState(false);
  if (!wallet) return null;
  const count = bids.length + sales.length;
  return <div className={`relative ${inline ? "w-full" : ""}`}>
    <button type="button" onClick={() => setOpen((value) => !value)} aria-label={`${count} marketplace notifications`} aria-expanded={open} className={`relative inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 font-semibold shadow-lg ${count ? "border-cyan-300/50 bg-gradient-to-r from-cyan-300/20 to-violet-400/20 text-cyan-100 shadow-cyan-950/40" : "border-white/10 bg-slate-950 text-slate-400"}`}>
      <Bell className={`h-5 w-5 ${count ? "animate-pulse" : ""}`}/>{!compact && <span className="hidden text-xs sm:inline">Marketplace alerts</span>}
      {count > 0 && <span className="absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full bg-gradient-to-r from-cyan-300 to-violet-400 px-1 text-xs font-bold text-slate-950 ring-2 ring-slate-950">{count}</span>}
    </button>
    {open && <div className={inline ? "mt-3" : "absolute right-0 top-full z-[70] mt-3 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-cyan-300/25 bg-[#080d17] p-4 shadow-2xl shadow-black/60"}><MarketplaceNotificationItems bids={bids} sales={sales} wallet={wallet} onRefresh={onRefresh}/></div>}
  </div>;
}