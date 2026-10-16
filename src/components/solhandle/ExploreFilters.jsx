import MobileSelect from '@/components/solhandle/MobileSelect';

const selectClass = "rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-300/50";

export default function ExploreFilters({ filters, onChange }) {
  const set = key => value => onChange({ ...filters, [key]: value });
  return (
    <div className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 sm:grid-cols-2 lg:grid-cols-3">
      <MobileSelect label="Rarity and length" value={filters.rarity} onChange={set('rarity')} className={selectClass} options={[{ value: '', label: 'All rarities & lengths' }, { value: 'LEGENDARY', label: 'Legendary · 1 character' }, { value: 'ULTRA_RARE', label: 'Ultra Rare · 2 characters' }, { value: 'RARE', label: 'Rare · 3 characters' }, { value: 'UNCOMMON', label: 'Uncommon · 4 characters' }, { value: 'STANDARD', label: 'Standard · 5+ characters' }]}/>
      <MobileSelect label="Type" value={filters.characterType} onChange={set('characterType')} className={selectClass} options={[{ value: '', label: 'All types' }, { value: 'LETTERS', label: 'Letters' }, { value: 'NUMBERS', label: 'Numbers' }, { value: 'ALPHANUMERIC', label: 'Alphanumeric' }]}/>
      <MobileSelect label="Sort by" value={filters.sort} onChange={set('sort')} className={selectClass} options={[{ value: 'newest', label: 'Newest' }, { value: 'oldest', label: 'Oldest' }, { value: 'shortest', label: 'Shortest' }]}/>
    </div>
  );
}