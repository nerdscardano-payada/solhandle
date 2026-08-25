const selectClass = "rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-300/50";

export default function ExploreFilters({ filters, onChange }) {
  const set = (key) => (event) => onChange({ ...filters, [key]: event.target.value });
  return (
    <div className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 sm:grid-cols-2 lg:grid-cols-4">
      <select value={filters.rarity} onChange={set("rarity")} className={selectClass} aria-label="Rarity"><option value="">All rarities</option><option value="LEGENDARY">Legendary</option><option value="ULTRA_RARE">Ultra Rare</option><option value="RARE">Rare</option><option value="UNCOMMON">Uncommon</option><option value="STANDARD">Standard</option></select>
      <select value={filters.length} onChange={set("length")} className={selectClass} aria-label="Length"><option value="">Any length</option><option value="1">1 character</option><option value="2">2 characters</option><option value="3">3 characters</option><option value="4">4 characters</option><option value="5+">5+ characters</option></select>
      <select value={filters.characterType} onChange={set("characterType")} className={selectClass} aria-label="Type"><option value="">All types</option><option value="LETTERS">Letters</option><option value="NUMBERS">Numbers</option><option value="ALPHANUMERIC">Alphanumeric</option></select>
      <select value={filters.sort} onChange={set("sort")} className={selectClass} aria-label="Sort by"><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="shortest">Shortest</option></select>
    </div>
  );
}