import { WalletCards, CreditCard, Store, Users } from 'lucide-react';

const categories = [
  { id: 'handles', label: 'My Handles', icon: WalletCards },
  { id: 'pay', label: 'Pay', icon: CreditCard },
  { id: 'marketplace', label: 'Marketplace', icon: Store },
  { id: 'earn', label: 'Share & Earn', icon: Users },
];

export default function DashboardCategories({ active, onChange }) {
  return <nav aria-label="Dashboard categories" className="mt-8 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-slate-950/70 p-2 sm:grid-cols-4">
    {categories.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => onChange(id)} aria-current={active === id ? 'page' : undefined} className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${active === id ? 'border border-cyan-300/40 bg-cyan-300/10 text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,.08)]' : 'border border-transparent text-slate-400 hover:bg-white/5 hover:text-white'}`}><Icon className="h-4 w-4 shrink-0"/>{label}</button>)}
  </nav>;
}