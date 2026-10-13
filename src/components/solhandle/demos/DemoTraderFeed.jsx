import { useState } from 'react';
import { Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
const trades = [
  { id: 1, side: 'BUY', pair: 'SOL / USDC', amount: '12.5 SOL', time: 'Example event 1' },
  { id: 2, side: 'SELL', pair: 'SOL / USDC', amount: '7 SOL', time: 'Example event 2' },
  { id: 3, side: 'BUY', pair: 'SOL / USDC', amount: '3 SOL', time: 'Example event 3' },
  { id: 4, side: 'SELL', pair: 'SOL / USDC', amount: '0.8 SOL', time: 'Example event 4' }
];
export default function DemoTraderFeed({ identity, enhanced, presentation }) {
  const [filter, setFilter] = useState('ALL');
  const name = identity ? enhanced ? identity.handle : identity.address : 'Run a lookup to reveal the trader';
  return <section className="space-y-5"><header className="flex flex-wrap items-center justify-between gap-3"><h3 className="flex items-center gap-2 font-semibold"><Activity className="h-5 w-5 text-names-accent"/>Trader activity</h3><span className="rounded-full border border-border px-3 py-1 text-xs text-names-secondary">Simulated feed</span></header>
    <p className="text-sm leading-6 text-muted-foreground">Scan who traded without decoding a wallet address on every row.</p>
    {!presentation && <div role="group" aria-label="Filter illustrative trades" className="flex gap-2">{['ALL', 'BUY', 'SELL'].map(side => <Button key={side} variant={filter === side ? 'secondary' : 'outline'} aria-pressed={filter === side} onClick={() => setFilter(side)} className="min-h-11">{side === 'ALL' ? 'All trades' : side === 'BUY' ? 'Buys' : 'Sells'}</Button>)}</div>}
    <ol className="space-y-0">{trades.filter(trade => filter === 'ALL' || trade.side === filter).map(trade => { const buying = trade.side === 'BUY', Icon = buying ? ArrowUpRight : ArrowDownRight; return <li key={trade.id} className="relative ml-4 border-l border-border pb-6 pl-7 last:pb-0"><span className={`absolute -left-4 top-0 flex h-8 w-8 items-center justify-center rounded-full border bg-card ${buying ? 'border-names-success/40 text-names-success' : 'border-names-warning/40 text-names-warning'}`}><Icon size={16}/></span><article className="space-y-3 rounded-xl border border-border bg-background p-4"><div className="flex flex-wrap items-center justify-between gap-2"><span className={buying ? 'text-xs font-semibold text-names-success' : 'text-xs font-semibold text-names-warning'}>{trade.side} · {trade.pair}</span><span className="text-xs text-muted-foreground">{trade.time}</span></div><p className={enhanced ? 'break-all text-xl font-semibold text-names-accent' : 'break-all font-mono text-xs leading-6'}>{name}</p>{enhanced && identity && <p className="break-all font-mono text-xs text-muted-foreground">{identity.address}</p>}<div className="flex flex-wrap justify-between gap-2 border-t border-border pt-3 text-sm"><span>{trade.amount}</span><span className="text-xs text-muted-foreground">Illustrative · no transaction evidence</span></div></article></li>; })}</ol>
  </section>;
}