import { useState } from "react";
import { Check, Copy, ExternalLink, Rocket } from "lucide-react";
import JupiterSwap from "@/components/solhandle/JupiterSwap";

export default function TokenLaunchTerminal({ tokenMint }) {
  const [copied, setCopied] = useState(false);
  if (!tokenMint) return <div className="flex min-h-[480px] items-center justify-center rounded-3xl border border-violet-400/30 bg-slate-950/80 p-8 text-center"><div><Rocket className="mx-auto h-8 w-8 text-violet-300"/><h3 className="mt-4 text-xl font-semibold">Launch configuration pending</h3><p className="mt-2 text-sm text-slate-400">Add the official CA in the admin dashboard to activate trading.</p></div></div>;
  const copy = async () => { await navigator.clipboard.writeText(tokenMint); setCopied(true); window.setTimeout(() => setCopied(false), 1500); };
  return <div className="rounded-3xl border border-violet-400/30 bg-slate-950/80 p-4 shadow-2xl shadow-violet-950/40">
    <div className="mb-4 flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wider text-violet-300">Live trading</p><h2 className="mt-1 text-xl font-semibold">$HANDLE / SOL</h2></div><span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-200">Live</span></div>
    <JupiterSwap tokenMint={tokenMint}/>
    <button type="button" onClick={copy} className="mt-4 flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left"><span className="min-w-0 truncate font-mono text-xs text-slate-400">{tokenMint}</span>{copied ? <Check className="h-4 w-4 shrink-0 text-emerald-300"/> : <Copy className="h-4 w-4 shrink-0 text-slate-400"/>}</button>
    <a href={`https://pump.fun/coin/${tokenMint}`} target="_blank" rel="noreferrer" className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-400 to-cyan-300 py-3 font-semibold text-slate-950">Trade on pump.fun <ExternalLink className="h-4 w-4"/></a>
  </div>;
}