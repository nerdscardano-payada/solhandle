import { useState } from 'react';
import { Button } from '@/components/ui/button';
import DemoIdentity from '@/components/solhandle/demos/DemoIdentity';
const content = { Transactions: ['Received · 0.50 SOL', 'Sent · 0.02 SOL'], Tokens: ['SOL · 24.82', 'USDC · 500'], NFTs: ['Example collectible · #001'], Activity: ['Example swap', 'Example NFT purchase'] };
export default function DemoExplorer({ identity }) {
  const [tab, setTab] = useState('Transactions');
  return <div className="space-y-6"><DemoIdentity identity={identity}/><div className="flex flex-wrap gap-2" role="tablist" aria-label="Explorer data">{Object.keys(content).map(key => <Button key={key} role="tab" aria-selected={key === tab} variant={key === tab ? 'secondary' : 'outline'} onClick={() => setTab(key)}>{key}</Button>)}</div><div role="tabpanel" className="rounded-xl border border-border"><p className="border-b border-border p-3 text-xs text-names-secondary">SIMULATED {tab.toUpperCase()} · not actual wallet activity</p>{content[tab].map(row => <p key={row} className="border-b border-border p-4 last:border-0">{row}</p>)}</div><p className="text-xs text-muted-foreground">The identity above is real. This generic explorer’s activity is illustrative. Open the explorer link for actual on-chain history.</p></div>;
}