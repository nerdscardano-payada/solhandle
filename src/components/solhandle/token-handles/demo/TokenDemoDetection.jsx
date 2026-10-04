import { useState } from 'react';
import { demoTokens } from '@/components/solhandle/token-handles/demo/tokenClaimDemoState';
import { Button } from '@/components/ui/button';

export default function TokenDemoDetection({ dispatch }) {
  const [mint, setMint] = useState(demoTokens[0].id);
  return <div className="space-y-4">
    <h3 className="text-xl font-semibold">1. Detect a sample token</h3>
    <p className="text-sm text-muted-foreground">Start with a mint fixture, not a user-entered ticker. These fictional identifiers are not Solana addresses; no live token is queried or claimed.</p>
    <label htmlFor="demo-token-mint" className="block text-sm font-medium">Sample mint</label>
    <select id="demo-token-mint" value={mint} onChange={event => setMint(event.target.value)} className="w-full rounded-lg border border-input bg-background p-3 text-foreground">{demoTokens.map(token => <option key={token.id} value={token.id}>{token.id} · {token.program} · {token.price} SOL tier</option>)}</select>
    <p className="text-sm text-muted-foreground">The candidate is fixed by sample metadata. Real detection must validate the actual mint and metadata before any claim.</p>
    <Button onClick={() => dispatch({ type: 'detect', id: mint })}>Find sample token</Button>
  </div>;
}