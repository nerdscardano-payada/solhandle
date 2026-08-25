import ProtectedBrandCard from "@/components/solhandle/ProtectedBrandCard";

export default function ProtectedBrandGroup({ title, description, brands, onClaim }) {
  if (!brands.length) return null;
  return (
    <section className="mt-10 first:mt-0">
      <div className="mb-5 border-b border-white/10 pb-4">
        <h3 className="text-2xl font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((brand) => <ProtectedBrandCard key={brand.handle} brand={brand} onClaim={onClaim}/>)}
      </div>
    </section>
  );
}