import { ArrowRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProtocolPaperCta() {
  return <div className="mt-6 flex flex-wrap items-center gap-4">
    <Link to="/protocol-paper" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-violet-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-950/30"><FileText className="h-4 w-4" />Read Protocol Paper<ArrowRight className="h-4 w-4" /></Link>
    <span className="text-xs text-slate-500">Protocol Paper v1.0 · Technical litepaper</span>
  </div>;
}