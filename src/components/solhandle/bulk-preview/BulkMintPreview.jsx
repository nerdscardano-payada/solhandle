import { useState } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import BulkPreviewCart from '@/components/solhandle/bulk-preview/BulkPreviewCart';
export default function BulkMintPreview() {
  const [open, setOpen] = useState(false);
  return <section className="dark mt-4 rounded-2xl border border-names-secondary/30 bg-card p-4 text-foreground">
    <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wider text-names-secondary">Sandbox experiment</p><p className="mt-1 text-sm text-muted-foreground">Bulk mint shopping cart · no real transactions</p></div><button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="flex shrink-0 items-center gap-2 rounded-lg border border-names-accent/30 px-3 py-2 text-sm font-semibold text-names-accent">{open ? <X className="h-4 w-4"/> : <ShoppingCart className="h-4 w-4"/>}{open ? 'Close preview' : 'Try cart'}</button></div>
    {open && <BulkPreviewCart/>}
  </section>;
}