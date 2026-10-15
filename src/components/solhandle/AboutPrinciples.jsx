import { Fingerprint, KeyRound, Network, RefreshCw } from "lucide-react";

const principles = [
  [Fingerprint, "Human-readable", "Replace long wallet addresses with a memorable identity that works across the Solana ecosystem."],
  [KeyRound, "Truly yours", "Your handle is an NFT in your wallet. SolHandle never takes custody and there are no renewals."],
  [Network, "Open infrastructure", "Wallets, apps and communities can resolve handles through the protocol and developer tools."],
  [RefreshCw, "Portable identity", "Transfer your handle like any other asset while ownership remains verifiable on-chain."]
];

export default function AboutPrinciples() {
  return <section className="px-5 py-10 md:px-9 md:py-16"><div className="mx-auto max-w-6xl"><p className="text-xs font-semibold uppercase tracking-[.2em] text-cyan-300">Why SolHandle</p><h2 className="mt-3 max-w-2xl text-2xl font-semibold md:text-3xl text-white">Identity should be simple for people and verifiable by anyone.</h2><div className="mt-6 grid gap-3 md:mt-9 md:grid-cols-2 md:gap-4">{principles.map(([Icon, title, body]) => <article key={title} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 md:p-6"><Icon className="h-6 w-6 text-emerald-300"/><h3 className="mt-5 text-lg font-semibold text-white">{title}</h3><p className="mt-2 leading-relaxed text-slate-400">{body}</p></article>)}</div></div></section>;
}