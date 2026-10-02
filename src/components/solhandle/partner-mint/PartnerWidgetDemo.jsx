import { useState } from 'react';
import { Search, ArrowUpRight, ArrowLeft, AtSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HandleSearchInput from '@/components/solhandle/HandleSearchInput';
export default function PartnerWidgetDemo() {
  const [input, setInput] = useState('ansem'), [handle, setHandle] = useState(''), [checkout, setCheckout] = useState(false), [error, setError] = useState('');
  const search = event => {
    event.preventDefault();
    const name = input.trim().replace(/^@+/, '').toLowerCase();
    if (!/^[a-z0-9]{1,20}$/.test(name)) { setError('Enter 1–20 letters or numbers.'); return; }
    setError(''); setHandle(name); setCheckout(false);
  };
  return <div className="mx-auto w-full max-w-lg rounded-2xl border border-names-accent/35 bg-card p-5 shadow-xl sm:p-7">
    <div className="flex items-center justify-between gap-3"><span className="flex items-center gap-2 text-sm font-semibold"><AtSign className="h-5 w-5 text-names-accent"/>SolHandle</span><span className="rounded-full border border-names-secondary/30 px-3 py-1 text-xs text-names-secondary">Interactive demo</span></div>
    {!checkout ? <><h3 className="mt-7 font-heading text-3xl font-semibold">Find your handle</h3><p className="mt-2 text-sm text-muted-foreground">Your name. Your wallet. Your identity.</p>
      <form onSubmit={search} className="mt-5 space-y-3"><HandleSearchInput input={input} onChange={value => { setInput(value); setHandle(''); setError(''); }}/><Button type="submit" className="w-full bg-names-accent text-background hover:bg-names-accent/90"><Search/>Search handle</Button></form>
      {error && <p role="alert" className="mt-3 text-sm text-names-warning">{error}</p>}
      {handle && <div aria-live="polite" className="mt-5 rounded-xl border border-names-success/30 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><strong className="break-all text-xl">@{handle}</strong><span className="text-xs text-names-success">Example: available</span></div><p className="mt-3 text-sm">Example mint fee <strong className="text-names-accent">0.10 SOL</strong></p><p className="mt-1 text-xs text-muted-foreground">Network and account costs are separate.</p><Button onClick={() => setCheckout(true)} className="mt-4 w-full border border-names-secondary/40 bg-names-secondary/15 text-foreground hover:bg-names-secondary/25">Claim handle<ArrowUpRight/></Button></div>}
    </> : <div aria-live="polite"><p className="mt-7 text-xs uppercase tracking-wider text-names-secondary">Checkout preview</p><h3 className="mt-2 break-all text-3xl font-semibold">Claim @{handle}</h3><p className="mt-3 text-sm text-muted-foreground">In the released integration, this step opens the partner-attributed SolHandle checkout, where you connect your wallet, review costs and sign.</p><dl className="mt-5 grid grid-cols-2 gap-3 text-sm"><dt>Example mint fee</dt><dd>0.10 SOL</dd><dt>Partner share</dt><dd>0.05 SOL</dd><dt>Protocol share</dt><dd>0.05 SOL</dd></dl><p className="mt-4 text-xs text-muted-foreground">Fees and account rent are separate and excluded from the split. This preview connects no wallet and creates no transaction.</p><Button onClick={() => setCheckout(false)} variant="outline" className="mt-5 w-full"><ArrowLeft/>Back to search</Button></div>}
    <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">Preview only. Availability and prices are illustrative, not checked on-chain. No live partner integration.</p>
  </div>;
}