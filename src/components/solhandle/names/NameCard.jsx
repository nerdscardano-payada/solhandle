import { Link } from 'react-router-dom';
import { ArrowUpRight, Eye, Search } from 'lucide-react';
import HandleCard from '@/components/solhandle/HandleCard';
const statuses = { AVAILABLE: ['Available', 'text-names-success'], OWNED: ['Owned', 'text-names-secondary'], FOR_SALE: ['For sale', 'text-names-warning'], RESERVED: ['Reserved', 'text-muted-foreground'], PROTECTED: ['Protected', 'text-muted-foreground'] };
export default function NameCard({ item }) {
  const [label, tone] = statuses[item.status] || ['Unavailable', 'text-muted-foreground'];
  return <article className="overflow-hidden rounded-2xl border border-border bg-card">
    <HandleCard handle={item.handle} display={`@${item.handle}`} to={`/@${item.handle}`} className="rounded-none border-0 border-b border-border" />
    <div className="p-4"><div className="flex items-center justify-between gap-2"><span className={`text-sm font-semibold ${tone}`}>{label}</span><span className="text-xs text-muted-foreground">{item.handle.length} characters</span></div>
      {item.askLamports != null && <p className="mt-2 text-sm text-names-warning">Ask: {(item.askLamports / 1e9).toLocaleString(undefined, { maximumFractionDigits: 9 })} SOL</p>}
      <div className="mt-4 space-y-2 text-sm text-muted-foreground"><p className="flex items-center gap-2"><Search className="h-4 w-4"/>{item.searches.toLocaleString()} unique search sessions · 30d</p><p className="flex items-center gap-2"><Eye className="h-4 w-4"/>{item.watchers.toLocaleString()} watching wallets</p></div>
      <Link to={`/@${item.handle}`} className="mt-4 flex items-center justify-between border-t border-border pt-3 text-sm font-medium text-names-accent">Inspect @{item.handle}<ArrowUpRight className="h-4 w-4"/></Link>
    </div>
  </article>;
}