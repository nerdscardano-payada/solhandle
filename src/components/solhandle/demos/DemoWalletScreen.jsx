import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, Copy, Wallet, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { demoPath } from '@/components/solhandle/demos/demoCatalog';
export default function DemoWalletScreen({ identity, enhanced = false, enabled = false }) {
  const [notice, setNotice] = useState(''); const reduced = useReducedMotion();
  const address = identity?.address; const readable = enhanced && enabled && Boolean(identity);
  async function copy() { try { await navigator.clipboard.writeText(readable ? identity.handle : address); setNotice('Copied'); } catch { setNotice('Select the identity above to copy it.'); } }
  return <section className={`min-w-0 rounded-3xl border p-4 md:p-5 ${enhanced ? 'border-names-accent/40 bg-names-accent/5' : 'border-border bg-card'}`}>
    <div className="mb-4 flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-widest"><span className={enhanced ? 'text-names-accent' : 'text-muted-foreground'}>{enhanced ? 'With SolHandle' : 'Without SolHandle'}</span><span className="text-muted-foreground">{enhanced ? 'Human-readable' : 'Address only'}</span></div>
    <div className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="flex items-center justify-between border-b border-border px-5 py-4"><span className="flex items-center gap-2 text-sm font-semibold"><Wallet size={18}/>My wallet</span><span className="text-xs text-muted-foreground">Concept UI</span></div>
      <div className="px-5 py-6"><div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border ${readable ? 'border-names-accent/40 bg-names-accent/10 text-names-accent' : 'border-border bg-muted text-muted-foreground'}`}><span className="text-2xl font-semibold">{readable ? '@' : <Wallet size={22}/>}</span></div>
        <p className="mb-2 text-xs text-muted-foreground">Wallet identity</p><div className="flex min-h-20 items-start justify-between gap-2"><AnimatePresence mode="wait" initial={false}><motion.div key={readable ? 'name' : 'address'} initial={{ opacity: 0, y: reduced ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .25 }} className="min-w-0 flex-1">{readable ? <p className="break-all text-3xl font-semibold text-names-accent md:text-4xl">{identity.handle}</p> : <p className="break-all font-mono text-sm leading-6">{address || 'Resolve a real handle to reveal its wallet.'}</p>}{readable && <p className="mt-2 break-all font-mono text-xs text-muted-foreground">{address}</p>}</motion.div></AnimatePresence>{identity && <button type="button" onClick={copy} aria-label={readable ? 'Copy handle' : 'Copy wallet address'} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground"><Copy size={16}/></button>}</div>
        <p className="mt-3 min-h-5 text-xs text-names-success">{readable ? <span className="inline-flex items-center gap-1"><ShieldCheck size={14}/>Identity verified on Solana</span> : 'Same account. Same ownership.'}</p>
        <div className="mt-5 border-t border-border pt-5"><p className="text-xs text-muted-foreground">Illustrative balance</p><p className="mt-2 text-3xl font-semibold">24.82 <span className="text-lg text-muted-foreground">SOL</span></p></div>
        <div className="mt-5 grid grid-cols-2 gap-2">{identity ? <><Button asChild variant="outline" className="min-h-11"><Link to={demoPath('wallet-send', identity.handle)}><ArrowUpRight/>Send</Link></Button><Button asChild variant="outline" className="min-h-11"><Link to={demoPath('wallet-receive', identity.handle)}><ArrowDownLeft/>Receive</Link></Button></> : <><Button variant="outline" disabled>Send</Button><Button variant="outline" disabled>Receive</Button></>}</div>
        <div className="mt-5 space-y-3 border-t border-border pt-4">{[['SOL', 'Solana', '24.82'], ['USDC', 'USD Coin', '500.00']].map(([symbol, name, amount]) => <div key={symbol} className="flex items-center justify-between gap-2 text-sm"><div><p className="font-semibold">{symbol}</p><p className="text-xs text-muted-foreground">{name}</p></div><span>{amount}</span></div>)}</div><p className="mt-4 text-xs text-muted-foreground">Example balances, not this wallet’s funds.</p>{notice && <p role="status" className="mt-2 text-xs text-names-accent">{notice}</p>}
      </div>
    </div>
  </section>;
}