import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { base44 } from "@/api/base44Client";

export default function AdminTokenLaunchSettings() {
  const [record, setRecord] = useState(null);
  const [mint, setMint] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    base44.entities.TokenLaunchSettings.list("-updated_date", 1).then((records) => {
      setRecord(records[0] || null);
      setMint(records[0]?.token_mint_address || "");
    });
  }, []);

  const save = async () => {
    const value = mint.trim();
    try { new PublicKey(value); } catch { setMessage("Enter a valid Solana contract address."); return; }
    setSaving(true); setMessage("");
    try {
      const saved = record
        ? await base44.entities.TokenLaunchSettings.update(record.id, { token_mint_address: value })
        : await base44.entities.TokenLaunchSettings.create({ token_mint_address: value });
      setRecord(saved); setMint(value); setMessage("$HANDLE is live across charts and trading.");
    } catch { setMessage("Unable to save the launch address."); }
    finally { setSaving(false); }
  };

  return <section className="card-glow mt-8"><p className="text-xs font-semibold uppercase tracking-wider text-violet-300">$HANDLE launch control</p><h2 className="mt-1 text-2xl font-semibold">Activate live trading</h2><p className="mt-2 text-sm text-slate-400">Save the official CA once to activate DexScreener, Jupiter and pump.fun.</p><div className="mt-5 flex flex-col gap-3 sm:flex-row"><input value={mint} onChange={(event) => setMint(event.target.value)} placeholder="Official $HANDLE contract address" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950 px-4 py-3 font-mono text-sm text-white outline-none focus:border-violet-400/60"/><button type="button" onClick={save} disabled={saving} className="rounded-xl bg-gradient-to-r from-violet-400 to-cyan-300 px-6 py-3 font-semibold text-slate-950 disabled:opacity-50">{saving ? "Activating…" : "Activate launch"}</button></div>{message && <p className="mt-3 text-sm text-slate-300">{message}</p>}</section>;
}