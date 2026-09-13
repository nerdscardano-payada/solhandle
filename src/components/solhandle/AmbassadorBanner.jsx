import { Link } from "react-router-dom";
import { ArrowRight, Megaphone } from "lucide-react";

export default function AmbassadorBanner() {
  return <Link to="/earn" className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-violet-300/25 bg-violet-400/10 px-4 py-3 text-left transition-colors hover:border-cyan-300/40 hover:bg-cyan-300/10"><span className="flex min-w-0 items-center gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-cyan-300 to-violet-400 text-slate-950"><Megaphone className="h-4 w-4"/></span><span><b className="block text-sm text-white">Share & Earn</b><span className="block text-xs text-slate-400">Become a SolHandle Ambassador and earn 20% per confirmed mint.</span></span></span><ArrowRight className="h-4 w-4 shrink-0 text-cyan-300"/></Link>;
}