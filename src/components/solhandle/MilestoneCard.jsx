import { Check, CircleDot, ArrowRight } from "lucide-react";

const statusStyles = {
  completed: "border-emerald-300/25 bg-emerald-300/5 text-emerald-200",
  current: "border-cyan-300/30 bg-cyan-300/5 text-cyan-200",
  upcoming: "border-violet-300/25 bg-violet-300/5 text-violet-200"
};

export default function MilestoneCard({ milestone }) {
  const label = milestone.status === "completed" ? "Completed" : milestone.status === "current" ? "In progress" : "Upcoming";
  return <article className="grid gap-5 border-t border-white/10 py-8 md:grid-cols-[120px_1fr]">
    <div><span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider ${statusStyles[milestone.status]}`}>{label}</span><p className="mt-3 font-mono text-sm text-slate-500">Phase {milestone.number}</p></div>
    <div><h2 className="text-2xl font-semibold text-white">{milestone.title}</h2><p className="mt-3 max-w-3xl leading-relaxed text-slate-400">{milestone.summary}</p>
      <div className="mt-5 grid gap-5 lg:grid-cols-2"><div><p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">Already delivered</p><ul className="space-y-2">{milestone.completed.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-300"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300"/>{item}</li>)}</ul></div>
        <div><p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">What follows</p>{milestone.upcoming ? <ul className="space-y-2">{milestone.upcoming.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-300"><CircleDot className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300"/>{item}</li>)}</ul> : <p className="flex gap-3 text-sm leading-relaxed text-slate-300"><ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-violet-300"/>{milestone.next}</p>}</div>
      </div>
    </div>
  </article>;
}