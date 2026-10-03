import { useState } from 'react';
import { Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BulkPreviewCheckout from '@/components/solhandle/bulk-preview/BulkPreviewCheckout';
export default function BulkPreviewCart() {
  const [input, setInput] = useState('ansem'), [items, setItems] = useState([]), [error, setError] = useState(''), [review, setReview] = useState(false);
  const add = event => {
    event.preventDefault();
    const handle = input.trim().replace(/^@+/, '').toLowerCase();
    if (!/^[a-z0-9]{1,20}$/.test(handle)) { setError('Enter 1–20 letters or numbers.'); return; }
    if (items.includes(handle)) { setError('This name is already in your cart.'); return; }
    if (items.length >= 10) { setError('The preview cart holds up to 10 names.'); return; }
    setItems([...items, handle]); setInput(''); setError('');
  };
  if (review) return <BulkPreviewCheckout items={items} onBack={() => setReview(false)} onReset={() => { setItems([]); setReview(false); setInput('ansem'); setError(''); }}/>;
  return <div className="mt-5 border-t border-border pt-5">
    <h3 className="flex items-center gap-2 text-xl font-semibold"><ShoppingCart className="h-5 w-5 text-names-accent"/>Your handle cart <span className="ml-auto text-sm text-names-secondary">{items.length}/10</span></h3>
    <p className="mt-2 text-sm text-muted-foreground">Explore the flow with any valid name. Availability is not checked and nothing is reserved.</p>
    <form onSubmit={add} className="mt-4 flex flex-wrap gap-2"><label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-names-accent/30 px-3"><span className="text-names-accent">@</span><Input aria-label="Handle for preview cart" placeholder="ansem" value={input} onChange={event => { setInput(event.target.value); setError(''); }} className="h-11 min-w-0 border-0 px-0 shadow-none focus-visible:ring-0"/></label><Button type="submit" className="h-11 bg-names-accent text-background hover:bg-names-accent/90"><Plus className="h-4 w-4"/>Add to cart</Button></form>
    {error && <p role="alert" className="mt-2 text-sm text-names-warning">{error}</p>}
    {!items.length ? <p className="my-6 rounded-xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground">Your cart is empty. Add a name to get started.</p> : <ul className="mt-4 space-y-2">{items.map(handle => <li key={handle} className="flex items-center gap-3 rounded-lg border border-border p-3"><span className="min-w-0 flex-1 break-all font-semibold">@{handle}<span className="block text-xs font-normal text-muted-foreground">Illustrative availability</span></span><span className="shrink-0 text-sm text-names-accent">0.10 SOL</span><button type="button" aria-label={`Remove @${handle}`} onClick={() => { setItems(items.filter(item => item !== handle)); setError(''); }} className="rounded p-2 text-muted-foreground hover:text-names-warning"><Trash2 className="h-4 w-4"/></button></li>)}</ul>}
    <div className="mt-4 flex justify-between text-sm"><span>Example mint subtotal</span><strong>{(items.length * 0.1).toFixed(2)} SOL</strong></div>
    <p className="mt-2 text-xs text-muted-foreground">0.10 SOL per name is an example, not an official quote. Network and account costs are excluded.</p>
    <Button disabled={!items.length} onClick={() => setReview(true)} className="mt-4 h-11 w-full bg-gradient-to-r from-names-success via-names-accent to-names-secondary font-semibold text-background hover:opacity-90">Review preview order</Button>
    {!!items.length && <button type="button" onClick={() => { setItems([]); setError(''); }} className="mt-3 w-full text-sm text-muted-foreground hover:text-names-accent">Clear cart</button>}
    <p className="mt-4 text-xs text-muted-foreground">Local preview only. No wallet connection, payments, metadata uploads or saved records. Leaving this preview discards the cart.</p>
  </div>;
}