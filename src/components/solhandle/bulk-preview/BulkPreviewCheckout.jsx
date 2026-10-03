import { useState } from 'react';
import { ArrowLeft, Check, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
export default function BulkPreviewCheckout({ items, onBack, onReset }) {
  const [approved, setApproved] = useState(0);
  const batches = Array.from({ length: Math.ceil(items.length / 2) }, (_, index) => items.slice(index * 2, index * 2 + 2));
  const complete = approved === batches.length;
  return <div className="mt-5 border-t border-border pt-5" aria-live="polite">
    <p className="text-xs font-semibold uppercase tracking-wider text-names-secondary">Simulated checkout · SOL only</p>
    <h3 className="mt-2 text-2xl font-semibold">{complete ? 'Preview order complete' : 'Review your order'}</h3>
    <p className="mt-2 text-sm text-muted-foreground">{items.length} names across {batches.length} example batches. Two names per batch is illustrative, not a validated execution limit.</p>
    <div className="mt-4 rounded-xl border border-names-accent/30 p-4"><div className="flex justify-between gap-3"><span>Example mint subtotal</span><strong className="text-names-accent">{(items.length * 0.1).toFixed(2)} SOL</strong></div><p className="mt-2 text-xs text-muted-foreground">Actual availability, prices, wallet balance and fees would be checked before a real checkout. They are not checked here.</p></div>
    <ol className="mt-4 space-y-3">{batches.map((batch, index) => <li key={index} className="rounded-xl border border-border p-3"><div className="flex items-center justify-between gap-2"><span className="flex items-center gap-2 text-sm font-semibold">{index < approved ? <Check className="h-4 w-4 text-names-success"/> : <Layers className="h-4 w-4 text-names-secondary"/>}Batch {index + 1}</span><span className={index < approved ? 'text-xs text-names-success' : 'text-xs text-muted-foreground'}>{index < approved ? 'Simulated success' : index === approved ? 'Ready to simulate' : 'Waiting'}</span></div><ul className="mt-2 space-y-1 text-sm">{batch.map(handle => <li key={handle} className="break-all">@{handle}<span className="ml-2 text-xs text-muted-foreground">{index < approved ? 'Not minted · simulation only' : 'Example price: 0.10 SOL'}</span></li>)}</ul></li>)}</ol>
    {!complete ? <Button onClick={() => setApproved(approved + 1)} className="mt-4 h-11 w-full bg-names-accent font-semibold text-background hover:bg-names-accent/90">Simulate approval · batch {approved + 1} of {batches.length}</Button> : <><p className="mt-4 text-sm text-names-success">All {items.length} names completed the simulation. No NFTs were minted and no SOL was spent.</p><Button onClick={onReset} className="mt-4 w-full bg-names-accent text-background hover:bg-names-accent/90">Start another preview order</Button></>}
    {!approved && <Button variant="outline" onClick={onBack} className="mt-3 w-full"><ArrowLeft className="h-4 w-4"/>Back to cart</Button>}
    {!!approved && !complete && <Button variant="outline" onClick={onReset} className="mt-3 w-full">Discard simulation and start over</Button>}
    <p className="mt-4 text-xs leading-relaxed text-muted-foreground">In a real checkout, each transaction is all-or-nothing; the complete order is not. Earlier successful batches remain minted if a later batch fails. Wallet approval screens may differ.</p>
  </div>;
}