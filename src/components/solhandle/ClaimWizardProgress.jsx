import { Check } from "lucide-react";

const steps = ["Request", "Domain", "Wallet", "Review"];

export default function ClaimWizardProgress({ currentStep }) {
  return <div className="mb-5 grid grid-cols-4 gap-2" aria-label={`Step ${currentStep} of 4`}>
    {steps.map((label, index) => {
      const number = index + 1;
      const complete = number < currentStep;
      const active = number === currentStep;
      return <div key={label} className="text-center">
        <div className={`mx-auto grid h-8 w-8 place-items-center rounded-full border text-xs font-semibold ${complete ? "border-emerald-300 bg-emerald-300 text-slate-950" : active ? "border-cyan-300 bg-cyan-300/15 text-cyan-200" : "border-white/10 bg-slate-900 text-slate-500"}`}>{complete ? <Check className="h-4 w-4"/> : number}</div>
        <span className={`mt-1 block text-xs ${active ? "text-cyan-200" : complete ? "text-emerald-300" : "text-slate-500"}`}>{label}</span>
      </div>;
    })}
  </div>;
}