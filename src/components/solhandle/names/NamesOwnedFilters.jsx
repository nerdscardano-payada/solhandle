import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import ExploreFilters from '@/components/solhandle/ExploreFilters';

export default function NamesOwnedFilters({ filters, preset, onFilters, onPreset }) {
  const [open, setOpen] = useState(false);
  const active = preset !== 'all' || filters.rarity || filters.characterType;
  return <div>
    <button type="button" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-controls="names-owned-filters" className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-3 py-3 text-sm sm:hidden"><span>Filters{active ? ' · Active' : ''}</span><ChevronDown className={open ? 'h-4 w-4 rotate-180' : 'h-4 w-4'}/></button>
    <div id="names-owned-filters" className={open ? 'mt-3 sm:mt-0' : 'hidden sm:block'}>
      <div className="mb-3 flex flex-wrap gap-3 text-sm">{[['all', 'All owned'], ['premium', 'Premium'], ['short', 'Short names']].map(([value, label]) => <button key={value} type="button" onClick={() => onPreset(value)} className={preset === value ? 'text-names-accent' : 'text-muted-foreground'}>{label}</button>)}</div>
      <ExploreFilters filters={filters} onChange={onFilters}/>
    </div>
  </div>;
}