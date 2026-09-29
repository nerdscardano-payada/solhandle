import { Link } from 'react-router-dom';
import Header from '@/components/solhandle/Header';
import HandlePaymentQuotePreview from '@/components/solhandle/HandlePaymentQuotePreview';

export default function HandleMintPayments() {
  return <main className="min-h-screen bg-slate-950 text-white"><div className="mx-auto min-h-screen max-w-7xl border-x border-white/10"><Header/><section className="mx-auto max-w-4xl px-5 py-12 sm:py-20">
    <Link to="/growth" className="text-sm text-cyan-300 hover:text-cyan-100">← Back to Growth Curve</Link>
    <div className="mt-8"><span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-200">In progress · Not available yet</span><h1 className="mt-5 text-4xl font-semibold sm:text-5xl">Mint a handle with $HANDLE</h1><p className="mt-4 text-lg leading-relaxed text-slate-300">We’re working on an optional way to pay for a new SolHandle with $HANDLE. Minting with SOL remains available today.</p></div>
    <div className="mt-8 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-cyan-300/20 bg-slate-900/60 p-5"><p className="text-sm text-cyan-300">Proposed mint discount</p><p className="mt-2 text-3xl font-semibold">5%</p><p className="mt-3 text-sm leading-relaxed text-slate-400">A proposed discount when choosing $HANDLE instead of SOL. Final pricing is subject to implementation and review.</p></div><div className="rounded-2xl border border-violet-300/20 bg-slate-900/60 p-5"><p className="text-sm text-violet-300">Proposed token burn</p><p className="mt-2 text-3xl font-semibold">50%</p><p className="mt-3 text-sm leading-relaxed text-slate-400">The plan is to burn half of the $HANDLE paid for each mint, verifiably on-chain.</p></div></div>
    <HandlePaymentQuotePreview />
    <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-sm leading-relaxed text-slate-300"><h2 className="text-lg font-semibold text-white">Before this goes live</h2><p className="mt-2">Payment and NFT minting must succeed in one atomic transaction, with pricing, burn and treasury accounting reviewed and tested. No $HANDLE mint payment is available on this page yet.</p></div>
    <Link to="/roadmap" className="mt-7 inline-block text-sm font-medium text-cyan-300 underline underline-offset-4">View the roadmap →</Link>
  </section></div></main>;
}