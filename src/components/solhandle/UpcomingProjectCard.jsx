import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function UpcomingProjectCard({ phase, title, status, summary, items, accent, path }) {
  const color = accent === "violet" ? "border-violet-400/30 shadow-violet-950/30" : "border-cyan-300/30 shadow-cyan-950/30";
  const badge = accent === "violet" ? "border-violet-400/30 bg-violet-400/10 text-violet-200" : "border-cyan-300/30 bg-cyan-300/10 text-cyan-200";
  return <article className={`flex h-full flex-col rounded-3xl border bg-slate-950/70 p-6 shadow-2xl backdrop-blur-xl md:p-8 ${color}`}>
    <div className="flex items-center justify-between gap-4">
      <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${badge}`}>{phase}</span>
      <span className="text-xs font-medium uppercase tracking-wider text-slate-500">{status}</span>
    </div>
    <h2 className="mt-6 text-2xl font-semibold text-white md:text-3xl">{title}</h2>
    <p className="mt-3 leading-relaxed text-slate-300">{summary}</p>
    <ul className="mt-6 flex-1 space-y-3">{items.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-300"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />{item}</li>)}</ul>
    <Link to={path} className="mt-7 flex items-center gap-2 border-t border-white/10 pt-5 text-sm font-medium text-white hover:text-cyan-200">Open interactive demo <ArrowRight className="h-4 w-4" /></Link>
  </article>;
}