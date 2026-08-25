import { BadgeCheck, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProtectedBrandCard({ brand, onClaim }) {
  const reserved = brand.restrictionType === "RESERVED";
  const description = reserved ? "Reserved for verified official organization claim." : "Protected under SolHandle’s trademark and impersonation policy.";

  return (
    <article className="flex flex-col rounded-2xl border border-white/10 bg-slate-950/70 p-5 shadow-lg shadow-black/20">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10"><Building2 className="h-5 w-5 text-cyan-200"/></div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-300/10 px-2.5 py-1 text-xs text-emerald-200"><BadgeCheck className="h-3.5 w-3.5"/>{reserved ? "Reserved" : "Protected"}</span>
      </div>
      <h3 className="mt-5 text-xl font-semibold text-white">@{brand.handle}</h3>
      {brand.domain && <a href={`https://${brand.domain}`} target="_blank" rel="noreferrer" className="mt-1 text-sm text-cyan-200 underline-offset-4 hover:underline">{brand.domain}</a>}
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{description}</p>
      {reserved ? <button onClick={() => onClaim(brand)} className="mt-5 w-full rounded-lg bg-gradient-to-r from-emerald-300 via-cyan-400 to-violet-500 px-4 py-2.5 text-sm font-semibold text-slate-950">Claim @{brand.handle}</button> : <Link to={`/contact?handle=${encodeURIComponent(brand.handle)}`} className="mt-5 block w-full rounded-lg border border-cyan-300/30 bg-cyan-300/5 px-4 py-2.5 text-center text-sm font-semibold text-cyan-200">Request information</Link>}
    </article>
  );
}