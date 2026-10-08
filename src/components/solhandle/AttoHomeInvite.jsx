import { ArrowRight } from 'lucide-react';

export default function AttoHomeInvite() {
  return <button type="button" onClick={() => window.dispatchEvent(new Event('solhandle:open-atto'))} className="mt-6 flex w-full max-w-md items-center gap-3 rounded-2xl border border-cyan-300/30 bg-slate-900/80 p-3 text-left transition-colors hover:border-cyan-300/70 hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300">
    <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-cyan-100">Meet Atto · Your SolHandle guide</span><span className="block text-xs leading-relaxed text-slate-400">Ask about handles, Pay, trading, Growth or integrations.</span></span>
    <ArrowRight className="h-4 w-4 shrink-0 text-cyan-300" />
  </button>;
}