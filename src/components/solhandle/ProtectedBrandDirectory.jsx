import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { base44 } from "@/api/base44Client";
import OfficialClaimDialog from "@/components/solhandle/OfficialClaimDialog";
import ProtectedBrandCard from "@/components/solhandle/ProtectedBrandCard";

export default function ProtectedBrandDirectory() {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [state, setState] = useState("loading");

  useEffect(() => {
    let active = true;
    Promise.all([base44.entities.ProtectedName.filter({ status: "active" }, "handle", 500), base44.entities.OfficialClaimPolicy.filter({ active: true }, "handle", 500)]).then(([names, policies]) => {
      const merged = new Map();
      names.forEach((item) => merged.set(item.handle.toLowerCase(), { ...item, handle: item.handle.toLowerCase(), restrictionType: item.restriction_type || (item.category === "brand" ? "PROTECTED" : "RESERVED") }));
      policies.forEach((item) => { const key = item.handle.toLowerCase(); merged.set(key, { ...merged.get(key), handle: key, domain: item.official_domain, policy: true }); });
      const sorted = [...merged.values()].sort((a, b) => a.handle === "solana" ? -1 : b.handle === "solana" ? 1 : a.handle.localeCompare(b.handle));
      if (active) { setBrands(sorted); setState("ready"); }
    }).catch(() => active && setState("error"));
    return () => { active = false; };
  }, []);

  if (state === "loading") return <p className="py-12 text-center text-slate-400">Loading protected brands…</p>;
  if (state === "error") return <p className="rounded-xl border border-rose-300/20 bg-rose-300/5 p-5 text-rose-200">The protected brand directory could not be loaded.</p>;
  if (!brands.length) return <p className="py-12 text-center text-slate-400">No protected brands are listed yet.</p>;

  return <div>
    <div className="mb-5 flex items-center justify-between"><p className="text-sm text-slate-400">{brands.length} protected organizations</p><p className="flex items-center gap-2 text-xs text-emerald-300"><ShieldCheck className="h-4 w-4"/>Protected & reserved</p></div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{brands.map((brand) => <ProtectedBrandCard key={brand.handle} brand={brand} onClaim={setSelectedBrand}/>)}</div>
    <OfficialClaimDialog open={Boolean(selectedBrand)} onOpenChange={(open) => !open && setSelectedBrand(null)} handle={selectedBrand?.handle || ""} restriction={{ reservedFor: selectedBrand?.reserved_for || "" }}/>
  </div>;
}