const selectClass = "rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-300/50";

export default function ExploreFilters({ filters, onChange }) {
  const set = (key) => (event) => onChange({ ...filters, [key]: event.target.value });
  return (
    <div className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 sm:grid-cols-2 lg:grid-cols-3">
      <select value={filters.rarity} onChange={set("rarity")} className={selectClass} aria-label="Rarity and length"><option value="">All rarities & lengths</option><option value="LEGENDARY">Legendary · 1 character</option><option value="ULTRA_RARE">Ultra Rare · 2 characters</option><option value="RARE">Rare · 3 characters</option><option value="UNCOMMON">Uncommon · 4 characters</option><option value="STANDARD">Standard · 5+ characters</option></select>
      <select value={filters.characterType} onChange={set("characterType")} className={selectClass} aria-label="Type"><option value="">All types</option><option value="LETTERS">Letters</option><option value="NUMBERS">Numbers</option><option value="ALPHANUMERIC">Alphanumeric</option></select>
      <select value={filters.sort} onChange={set("sort")} className={selectClass} aria-label="Sort by"><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="shortest">Shortest</option></select>
    </div>
  );
}