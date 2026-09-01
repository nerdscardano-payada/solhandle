import Header from "@/components/solhandle/Header";
import MilestoneCard from "@/components/solhandle/MilestoneCard";
import { roadmapMilestones } from "@/lib/roadmapMilestones";

const launchAt = new Date("2026-09-04T13:00:00Z");

export default function Roadmap() {
  const launchLabel = new Intl.DateTimeFormat(undefined, { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", timeZoneName: "short" }).format(launchAt);
  return <main className="min-h-screen bg-slate-950 text-white"><div className="mx-auto min-h-screen max-w-7xl border-x border-white/10"><Header/><section className="px-5 py-12 md:px-9">
    <p className="text-sm font-medium tracking-wider text-cyan-300">SOLHANDLE MILESTONES</p><h1 className="mt-2 max-w-4xl text-4xl font-semibold md:text-5xl">Built in public. Moving toward launch.</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">A clear record of what SolHandle has delivered, what is being finalized now, and what comes after launch.</p>
    <div className="mt-8 grid gap-3 sm:grid-cols-3"><div className="rounded-xl border border-emerald-300/20 bg-emerald-300/5 p-4"><p className="text-xs uppercase tracking-wider text-emerald-300">Delivered</p><p className="mt-2 font-semibold">Protocol through Mainnet</p></div><div className="rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-4"><p className="text-xs uppercase tracking-wider text-cyan-300">Current focus</p><p className="mt-2 font-semibold">Security review & launch</p></div><div className="rounded-xl border border-violet-300/20 bg-violet-300/5 p-4"><p className="text-xs uppercase tracking-wider text-violet-300">Public mint</p><p className="mt-2 font-semibold">{launchLabel}</p></div></div>
    <div className="mt-10">{roadmapMilestones.map((milestone) => <MilestoneCard key={milestone.number} milestone={milestone}/>)}</div>
    <div className="mt-2 rounded-xl border border-white/10 bg-white/5 p-5 text-sm leading-relaxed text-slate-400"><strong className="text-white">Roadmap principle:</strong> dates describe current intent, while security and protocol integrity take priority. Completed items stay subject to monitoring and improvement after launch.</div>
  </section></div></main>;
}