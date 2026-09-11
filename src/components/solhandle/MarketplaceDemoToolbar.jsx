import { Plus, Search } from "lucide-react";

export default function MarketplaceDemoToolbar({ query, setQuery, sort, setSort, onList }) {
  return <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/70 p-4 sm:flex-row">
    <label className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search handles" className="h-10 w-full rounded-xl border border-white/10 bg-slate-900 pl-10 pr-3 text-sm text-white outline-none focus:border-cyan-300/50" /></label>
    <select value={sort} onChange={(event) => setSort(event.target.value)} className="h-10 rounded-xl border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none">
      <option value="featured">Featured</option><option value="low">Price: low first</option><option value="high">Price: high first</option>
    </select>
    <button type="button" onClick={onList} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-emerald-300 px-4 text-sm font-semibold text-slate-950"><Plus className="h-4 w-4" /> List a handle</button>
  </div>;
}