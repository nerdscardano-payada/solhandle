import { CheckCircle2, ExternalLink, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function PurchaseConfirmation({ purchase, onDismiss }) {
  if (!purchase) return null;
  return (
    <div role="status" className="fixed right-5 top-24 z-50 w-[calc(100%-2.5rem)] max-w-sm rounded-xl border border-white/15 bg-[#191e27] p-4 shadow-2xl shadow-black/60">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-300" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-white">Purchase confirmed</p>
          <p className="mt-1 text-sm text-slate-300">@{purchase.handle} is now in your wallet and has been removed from the market.</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-medium">
            <Link to="/my-handles" className="rounded-lg bg-emerald-300 px-3 py-2 text-slate-950">View My Handles</Link>
            <a href={`https://explorer.solana.com/tx/${purchase.signature}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-white">View transaction <ExternalLink className="h-3.5 w-3.5" /></a>
          </div>
        </div>
        <button type="button" onClick={onDismiss} aria-label="Dismiss confirmation" className="rounded-lg p-1 text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
      </div>
    </div>
  );
}