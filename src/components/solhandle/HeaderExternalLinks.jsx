import { ExternalLink } from "lucide-react";

export default function HeaderExternalLinks() {
  return <div className="hidden items-center gap-3 sm:flex"><a href="https://x.com/Solhandle" target="_blank" rel="noreferrer" aria-label="SolHandle on X" className="text-xs font-semibold text-slate-400 transition hover:text-white">X</a><a href="https://magiceden.io/marketplace/solhandle" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 transition hover:text-cyan-200">Trade <ExternalLink className="h-3 w-3"/></a></div>;
}