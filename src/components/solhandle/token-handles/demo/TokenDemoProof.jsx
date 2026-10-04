import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function TokenDemoProof({ state, dispatch }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, []);
  function challenge() {
    const issued = Date.now();
    dispatch({ type: 'challenge', challenge: { nonce: crypto.randomUUID(), issued, expires: issued + 300000 } });
    setNow(issued);
  }
  const expired = state.challenge && now >= state.challenge.expires;
  const message = state.challenge && ['SolHandle Token Verification · DEMO ONLY', 'Domain: solhandle.io', 'Network: SIMULATED (not Mainnet or Devnet)', `Claim: DEMO-${state.challenge.nonce}`, `Mint fixture: ${state.token.id}`, `Symbol: $${state.token.symbol}`, `Claimant: ${state.wallet}`, `Nonce: ${state.challenge.nonce}`, `Issued: ${new Date(state.challenge.issued).toISOString()}`, `Expires: ${new Date(state.challenge.expires).toISOString()}`, 'Purpose: demonstrate wallet control only', 'This does not transfer tokens or SOL.'].join('\n');
  return <div className="space-y-4">
    <h3 className="text-xl font-semibold">2. Demonstrate wallet control</h3>
    <p className="text-sm text-muted-foreground">A real claim uses the authorized wallet and a server-generated, single-use challenge. This demo never opens your wallet or verifies a signature.</p>
    {!state.challenge ? <Button onClick={challenge}>Select demo claimant & create challenge</Button> : <>
      <pre className="overflow-hidden whitespace-pre-wrap break-all rounded-xl border border-border bg-background p-4 text-xs leading-relaxed">{message}</pre>
      <p className="text-sm text-names-warning">{expired ? 'Challenge expired. Generate a new sample challenge.' : `Sample challenge expires in ${Math.max(0, Math.ceil((state.challenge.expires - now) / 1000))} seconds.`}</p>
      <Button disabled={!!expired} onClick={() => dispatch({ type: 'proof' })}>Simulate wallet-control proof</Button>
      {expired && <Button variant="outline" onClick={challenge}>Generate new sample challenge</Button>}
    </>}
    <p className="text-xs text-muted-foreground">Wallet control alone does not prove project ownership or entitlement to the symbol.</p>
  </div>;
}