import { LockKeyhole, ShieldCheck } from "lucide-react";

export default function LoungeGate({ address, loading, error, onEnter }) {
  const connect = () => window.dispatchEvent(new CustomEvent("solhandle:connect-wallet"));
  return <section className="mx-auto max-w-xl px-5 py-16 text-center md:py-24">
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10"><LockKeyhole className="h-7 w-7 text-cyan-200" /></div>
    <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-cyan-300">Token-gated community</p><h1 className="mt-3 text-4xl font-semibold">Holder Lounge</h1>
    <p className="mt-4 leading-relaxed text-slate-400">A private space for verified SolHandle holders. Connect your wallet and sign a free message to enter.</p>
    <div className="mt-6 flex items-center justify-center gap-2 text-sm text-emerald-300"><ShieldCheck className="h-4 w-4" />No transaction. No wallet custody.</div>
    <button onClick={address ? onEnter : connect} disabled={loading} className="mt-8 rounded-xl bg-cyan-300 px-6 py-3 font-semibold text-slate-950 disabled:opacity-50">{loading ? "Verifying…" : address ? "Verify & enter" : "Connect wallet"}</button>
    {error && <p className="mt-4 rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p>}
  </section>;
}