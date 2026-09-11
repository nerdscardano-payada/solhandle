import { useState } from "react";
import { X } from "lucide-react";

export default function MarketplaceDemoModal({ dialog, onClose, onComplete }) {
  const [handle, setHandle] = useState("");
  const [price, setPrice] = useState(dialog.listing?.price || "");
  const title = dialog.mode === "buy" ? `Buy ${dialog.listing.handle}` : dialog.mode === "offer" ? `Offer on ${dialog.listing.handle}` : "List a handle";
  const submit = (event) => {
    event.preventDefault();
    onComplete({ mode: dialog.mode, handle: dialog.listing?.handle || handle, price });
  };
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
    <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-cyan-300/25 bg-slate-950 p-6 shadow-2xl shadow-cyan-950/40">
      <div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">Demo transaction</p><h2 className="mt-1 text-xl font-semibold text-white">{title}</h2></div><button type="button" onClick={onClose} aria-label="Close"><X className="h-5 w-5 text-slate-400" /></button></div>
      {dialog.mode === "list" && <label className="mt-6 block text-sm text-slate-300">Handle<input required value={handle} onChange={(event) => setHandle(event.target.value)} placeholder="@ansem" className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-slate-900 px-3 text-white outline-none" /></label>}
      {dialog.mode !== "buy" && <label className="mt-4 block text-sm text-slate-300">Price in SOL<input required min="0.01" step="0.01" type="number" value={price} onChange={(event) => setPrice(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-slate-900 px-3 text-white outline-none" /></label>}
      {dialog.mode === "buy" && <div className="mt-6 rounded-2xl bg-white/5 p-4"><div className="flex justify-between text-sm text-slate-300"><span>Price</span><span>{price} SOL</span></div><div className="mt-2 flex justify-between text-sm text-slate-300"><span>Protocol royalty</span><span>Included</span></div></div>}
      <p className="mt-5 text-xs leading-relaxed text-amber-200">Simulation only. No wallet opens and no SOL or asset moves.</p>
      <button className="mt-5 w-full rounded-xl bg-gradient-to-r from-cyan-300 to-emerald-300 py-3 font-semibold text-slate-950">Confirm demo {dialog.mode}</button>
    </form>
  </div>;
}