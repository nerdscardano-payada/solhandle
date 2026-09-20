import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const steps = [
  ["Own a SolHandle", "A confirmed SolHandle is your public identity and the revenue channel for your network."],
  ["Verify its owner wallet", "Connect the wallet that owns the handle; ownership is checked directly on-chain."],
  ["Generate your origin link", "Your personal handle link registers a pending referral for each new visitor."],
  ["Refer a real first mint", "The first confirmed mint permanently locks the wallet and minted asset to your origin handle."],
  ["Build economic activity", "Future mints, secondary royalties and received creator fees remain attributable to your network."],
  ["Qualify after launch", "Hold the required $HANDLE balance for 24 hours. Upgrades wait; balance-based downgrades apply immediately."],
];

export default function ReferralGettingStarted() {
  return <section className="mt-12 rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-6 md:p-8"><p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">How to get your referral link</p><h2 className="mt-2 text-3xl font-semibold">Own. Refer. Build. Earn.</h2><p className="mt-3 max-w-3xl leading-relaxed text-slate-400">A referral link is reserved for verified SolHandle owners. Origin relationships are permanent after the referred wallet completes its first real mint.</p><ol className="mt-7 grid gap-4 md:grid-cols-2">{steps.map(([title, text], index) => <li key={title} className="flex gap-4 rounded-xl border border-white/10 bg-slate-950/60 p-5"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-300 font-semibold text-slate-950">{index + 1}</span><div><h3 className="font-semibold text-white">{index === 0 ? <Link to="/" className="text-cyan-200 hover:text-cyan-100">{title} →</Link> : title}</h3><p className="mt-1 text-sm leading-relaxed text-slate-400">{text}</p></div></li>)}</ol><div className="mt-6 flex flex-wrap items-center gap-3"><Link to="/" className="rounded-lg bg-cyan-300 px-5 py-3 font-semibold text-slate-950">Search and mint a handle</Link><p className="flex items-center gap-2 text-sm text-slate-400"><CheckCircle2 className="h-4 w-4 text-emerald-300"/>No email account required</p></div></section>;
}