import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const steps = [
  ["Mint your own SolHandle", "Search for an available handle and complete a confirmed mainnet mint. You need at least one SolHandle before you can join."],
  ["Connect the owner wallet", "Go to the Earn page or My Handles and connect the same Solana wallet that owns your minted handle."],
  ["Choose your public identity", "Select one of your owned handles. SolHandle verifies its current NFT ownership on-chain."],
  ["Generate your referral link", "After verification, your personal referral link appears immediately in your Ambassador Dashboard."],
  ["Share and refer", "Share the link. Visitors can browse freely and must complete an eligible mint within the 30-day attribution window."],
  ["Earn and request payout", "You earn 20% after a confirmed mint. Rewards are verified for 24 hours and become payout-eligible from 0.15 SOL."],
];

export default function ReferralGettingStarted() {
  return <section className="mt-12 rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-6 md:p-8"><p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">How to get your referral link</p><h2 className="mt-2 text-3xl font-semibold">First mint. Then share. Then earn.</h2><p className="mt-3 max-w-3xl leading-relaxed text-slate-400">A referral link is reserved for verified SolHandle owners. Follow these steps from your first mint through your first payout.</p><ol className="mt-7 grid gap-4 md:grid-cols-2">{steps.map(([title, text], index) => <li key={title} className="flex gap-4 rounded-xl border border-white/10 bg-slate-950/60 p-5"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-300 font-semibold text-slate-950">{index + 1}</span><div><h3 className="font-semibold text-white">{index === 0 ? <Link to="/" className="text-cyan-200 hover:text-cyan-100">{title} →</Link> : title}</h3><p className="mt-1 text-sm leading-relaxed text-slate-400">{text}</p></div></li>)}</ol><div className="mt-6 flex flex-wrap items-center gap-3"><Link to="/" className="rounded-lg bg-cyan-300 px-5 py-3 font-semibold text-slate-950">Search and mint a handle</Link><p className="flex items-center gap-2 text-sm text-slate-400"><CheckCircle2 className="h-4 w-4 text-emerald-300"/>No email account required</p></div></section>;
}