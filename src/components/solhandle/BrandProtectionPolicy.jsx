import { ArrowDown, ShieldCheck } from "lucide-react";

const claimSteps = ["Reserved", "Organization verified", "Minted directly", "Claimed + verified"];

export default function BrandProtectionPolicy() {
  return (
    <section className="mt-12 rounded-2xl border border-cyan-300/20 bg-slate-950/70 p-6 md:p-8">
      <div className="flex items-center gap-3 text-cyan-200"><ShieldCheck className="h-5 w-5"/><p className="text-xs font-semibold uppercase tracking-[0.2em]">Brand & Ecosystem Protection</p></div>
      <h2 className="mt-4 text-2xl font-semibold md:text-3xl">We don&apos;t sell brands their identity. We protect it until they claim it.</h2>
      <div className="mt-5 grid gap-5 text-sm leading-relaxed text-slate-300 md:grid-cols-2">
        <p>SolHandle reserves a limited number of names associated with major Solana ecosystem organizations to prevent impersonation and name squatting. Reserved handles are not minted, owned, listed or sold by SolHandle.</p>
        <p>A verified organization may request its reserved handle at no charge. After domain and wallet verification, the handle is minted directly to the organization&apos;s specified wallet—without a SolHandle wallet ever becoming an owner.</p>
      </div>
      <div className="mt-7 flex flex-col items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 p-4 text-center text-xs font-semibold text-slate-200 sm:flex-row">
        {claimSteps.map((step, index) => <div key={step} className="contents"><span>{step}</span>{index < claimSteps.length - 1 && <ArrowDown className="h-4 w-4 text-cyan-300 sm:-rotate-90"/>}</div>)}
      </div>
      <p className="mt-5 text-xs leading-relaxed text-slate-500">Protected world-famous trademarks remain unavailable for public registration and are handled under SolHandle&apos;s trademark and impersonation policy. Listing a name does not imply partnership or endorsement.</p>
    </section>
  );
}