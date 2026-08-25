import { CheckCircle2, CircleAlert, LoaderCircle } from "lucide-react";

const steps = [
  ["metadata", "Publishing metadata"],
  ["wallet", "Wallet confirmation"],
  ["confirmed", "Claim confirmed"]
];

export default function MintProgress({ phase, error }) {
  if (!phase && !error) return null;
  if (error) return <div className="flex gap-2 rounded-lg border border-rose-400/25 bg-rose-400/10 p-3 text-sm text-rose-200"><CircleAlert className="h-4 w-4 shrink-0" />{error}</div>;
  const activeIndex = steps.findIndex(([value]) => value === phase);
  return <div className="space-y-3 rounded-xl border border-white/10 bg-slate-900/60 p-4">{steps.map(([value, label], index) => {
    const complete = phase === "confirmed" || index < activeIndex;
    const active = index === activeIndex && phase !== "confirmed";
    return <div key={value} className={`flex items-center gap-3 text-sm ${complete || active ? "text-cyan-100" : "text-slate-500"}`}>
      {complete ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : <LoaderCircle className={`h-4 w-4 ${active ? "animate-spin text-cyan-300" : "text-slate-600"}`} />}{label}
    </div>;
  })}</div>;
}