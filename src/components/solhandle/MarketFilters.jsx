import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const lengths = [['', '⌁ All lengths'], ['LEGENDARY', '1 character'], ['ULTRA_RARE', '2 characters'], ['RARE', '3 characters'], ['UNCOMMON', '4 characters'], ['STANDARD', '5–20 characters']];

export default function MarketFilters({ rarity, setRarity, maxPrice, setMaxPrice }) {
  const [open, setOpen] = useState(false);
  return <aside className="rounded-xl border border-white/10 bg-[#151a23] p-3 shadow-2xl shadow-black/20 lg:sticky lg:top-4">
    <button type="button" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-controls="market-filter-controls" className="flex w-full items-center justify-between text-sm font-semibold sm:hidden">Filters{(rarity || maxPrice) && <span className="text-xs text-names-accent">Active</span>}<ChevronDown className={open ? 'h-4 w-4 rotate-180' : 'h-4 w-4'} /></button>
    <div id="market-filter-controls" className={open ? 'pt-3 sm:pt-0' : 'hidden sm:block'}>
      <h2 className="px-1 pb-2 text-base font-semibold lg:text-sm lg:font-normal lg:tracking-normal lg:leading-normal">Length</h2>
      <div className="space-y-1 text-sm">{lengths.map(([value, label]) => <button key={value} type="button" onClick={() => setRarity(value)} className={`w-full rounded-lg px-3 py-2 text-left ${rarity === value ? 'bg-cyan-300 text-slate-950' : 'text-slate-300 hover:bg-white/5'}`}>{label}</button>)}</div>
      <div className="my-3 h-px bg-white/10" />
      <label className="px-1 text-xs text-slate-300" htmlFor="market-max-price">Maximum price in SOL</label>
      <input id="market-max-price" value={maxPrice} onChange={event => setMaxPrice(event.target.value)} inputMode="decimal" placeholder="0.00" className="mt-2 w-full rounded-lg border border-white/10 bg-[#10151e] px-3 py-2.5 text-sm outline-none placeholder:text-slate-600 focus:border-cyan-300/50" />
    </div>
  </aside>;
}