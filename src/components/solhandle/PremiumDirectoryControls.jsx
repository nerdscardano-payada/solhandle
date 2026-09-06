const selectClass = "rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-300/50";
const lengths = [2, 3, 4];

export default function PremiumDirectoryControls({ length, tier, category, categories, onLength, onTier, onCategory }) {
  return <div className="mt-7 space-y-4">
    <div className="flex flex-wrap gap-2">{lengths.map((value) => <button key={value} onClick={() => onLength(value)} className={`rounded-full px-4 py-2 text-sm font-medium ${length === value ? "bg-gradient-to-r from-emerald-300 to-cyan-300 text-slate-950" : "border border-white/10 text-slate-300"}`}>{value} Characters</button>)}</div>
    <div className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 sm:grid-cols-3"><select value={tier} onChange={(event) => onTier(event.target.value)} className={selectClass} aria-label="Tier"><option value="">All tiers</option><option value="S+">S+ Tier</option><option value="S">S Tier</option><option value="A">A Tier</option><option value="B">B Tier</option></select><select value={category} onChange={(event) => onCategory(event.target.value)} className={selectClass} aria-label="Category"><option value="">All categories</option>{categories.map((value) => <option key={value} value={value}>{value}</option>)}</select><div className="flex items-center gap-2 rounded-lg border border-emerald-300/20 bg-emerald-300/5 px-3 text-sm text-emerald-300"><span className="h-2 w-2 rounded-full bg-emerald-300"/>Live available only</div></div>
  </div>;
}