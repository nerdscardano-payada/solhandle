import { useEffect, useState } from "react";

export default function ReferralActivation({ handles, onActivate, loading }) {
  const [handle, setHandle] = useState(handles[0]?.handle || "");
  useEffect(() => {
    if (!handle && handles[0]?.handle) setHandle(String(handles[0].handle).replace(/^@/, ""));
  }, [handles, handle]);
  if (!handles.length) return <div className="card-glow mt-8 text-center"><h2 className="text-xl font-semibold text-white">Mint a SolHandle to start earning</h2><p className="mt-2 text-slate-400">Every verified holder can activate a personal referral identity.</p></div>;
  return <div className="card-glow mt-8"><p className="text-sm text-cyan-300">Activate Share & Earn</p><h2 className="mt-2 text-2xl font-semibold text-white">Choose your referral identity</h2><p className="mt-2 text-sm text-slate-400">Own multiple SolHandles? Choose one as your referral identity. You receive one referral link and one combined earnings balance per wallet. Earnings remain attached to this wallet, even if the selected NFT is transferred later.</p><div className="mt-5 flex flex-col gap-3 sm:flex-row"><select value={handle} onChange={(e) => setHandle(e.target.value)} className="rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-white">{handles.map((item) => <option key={item.handle} value={String(item.handle).replace(/^@/, "")}>{item.displayHandle || `@${String(item.handle).replace(/^@/, "")}`}</option>)}</select><button disabled={loading || !handle} onClick={() => onActivate(handle)} className="rounded-lg bg-cyan-300 px-5 py-3 font-semibold text-slate-950 disabled:opacity-50">{loading ? "Verifying ownership…" : "Start earning"}</button></div></div>;
}