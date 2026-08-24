import { useEffect, useState } from "react";
import { BadgeCheck, Building2, ShieldCheck } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ProtectedBrandDirectory() {
  const [brands, setBrands] = useState([]); const [state, setState] = useState("loading");
  useEffect(() => { let active = true; Promise.all([base44.entities.ProtectedName.filter({ status: "active" }), base44.entities.OfficialClaimPolicy.filter({ active: true })]).then(([names, policies]) => {
    const merged = new Map();
    names.forEach((item) => merged.set(item.handle.toLowerCase(), { handle: item.handle.toLowerCase(), category: item.category, reason: item.reason, protected: true }));
    policies.forEach((item) => { const key = item.handle.toLowerCase(); merged.set(key, { ...merged.get(key), handle: key, domain: item.official_domain, policy: true }); });
    if (active) { setBrands([...merged.values()].sort((a, b) => a.handle.localeCompare(b.handle))); setState("ready"); }
  }).catch(() => active && setState("error")); return () => { active = false; }; }, []);
  if (state === "loading") return <p className="py-12 text-center text-slate-400">Loading protected brands…</p>;
  if (state === "error") return <p className="rounded-xl border border-rose-300/20 bg-rose-300/5 p-5 text-rose-200">The protected brand directory could not be loaded.</p>;
  if (!brands.length) return <p className="py-12 text-center text-slate-400">No protected brands are listed yet.</p>;
  return <div><div className="mb-5 flex items-center justify-between"><p className="text-sm text-slate-400">{brands.length} protected {brands.length === 1 ? "organization" : "organizations"}</p><p className="flex items-center gap-2 text-xs text-emerald-300"><ShieldCheck className="h-4 w-4"/>Official claims only</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{brands.map((brand) => <article key={brand.handle} className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 shadow-lg shadow-black/20"><div className="flex items-start justify-between gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10"><Building2 className="h-5 w-5 text-cyan-200"/></div><span className="inline-flex items-center gap-1 rounded-full bg-emerald-300/10 px-2.5 py-1 text-xs text-emerald-200"><BadgeCheck className="h-3.5 w-3.5"/>Protected</span></div><h3 className="mt-5 text-xl font-semibold text-white">@{brand.handle}</h3>{brand.domain && <p className="mt-1 text-sm text-cyan-200">{brand.domain}</p>}<p className="mt-3 text-sm leading-relaxed text-slate-400">{brand.reason || "Reserved to protect the official organization and its community from impersonation."}</p><p className="mt-4 border-t border-white/5 pt-4 text-xs text-slate-500">Free mint after official verification and SolHandle approval.</p></article>)}</div></div>;
}