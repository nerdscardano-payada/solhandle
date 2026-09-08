import { BadgeCheck, ShieldCheck } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import useDiscordVerification from "@/hooks/useDiscordVerification";

export default function DiscordVerifyCard() {
  const token = new URLSearchParams(window.location.search).get("token") || "";
  const { connected, address, walletName, verify, loading, error, handle } = useDiscordVerification(token);
  if (handle) return <section className="card-glow max-w-xl text-center"><BadgeCheck className="mx-auto h-12 w-12 text-emerald-300"/><h1 className="mt-4 text-2xl font-semibold text-white">Verification complete</h1><p className="mt-3 text-slate-300">{handle} is verified. The Handle Holder role has been added in Discord.</p></section>;
  return <section className="card-glow max-w-xl">
    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-300/10"><ShieldCheck className="h-6 w-6 text-cyan-200"/></div>
    <h1 className="mt-5 text-2xl font-semibold text-white">Verify your SolHandle</h1>
    <p className="mt-3 text-sm leading-6 text-slate-400">Connect the wallet that owns an active SolHandle and sign a free message. No transaction is created and no funds can move.</p>
    {!token && <p className="mt-5 rounded-lg border border-amber-300/20 bg-amber-300/10 p-3 text-sm text-amber-100">This link is incomplete. Run /verify in the SolHandle Discord server.</p>}
    <div className="mt-6">{!connected ? <WalletMultiButton /> : <div className="space-y-3"><div className="rounded-lg border border-white/10 bg-white/5 p-3"><p className="text-xs uppercase tracking-wider text-slate-500">Selected wallet</p><p className="mt-1 font-semibold text-white">{walletName}</p><p className="mt-1 break-all font-mono text-xs text-slate-400">{address}</p></div><WalletMultiButton className="!w-full !justify-center"/><button type="button" disabled={!token || loading} onClick={verify} className="w-full rounded-lg bg-gradient-to-r from-cyan-300 to-violet-300 px-5 py-3 font-semibold text-slate-950 disabled:opacity-50">{loading ? "Verifying…" : `Sign with ${walletName}`}</button></div>}</div>
    {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}
  </section>;
}