import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import DemoIdentity from '@/components/solhandle/demos/DemoIdentity';
export default function DemoSend({ identity, payment = false }) {
  const [amount, setAmount] = useState('1'), [confirmed, setConfirmed] = useState(false);
  useEffect(() => { setConfirmed(false); }, [identity]);
  const valid = /^\d+(\.\d{1,9})?$/.test(amount) && Number(amount) > 0 && Number.isSafeInteger(Math.round(Number(amount) * 1e9));
  return <div className="space-y-6"><p className="text-xs uppercase tracking-widest text-names-secondary">Demo mode · no signing · no funds moved</p><DemoIdentity identity={identity}/><label className="block space-y-2 text-sm"><span>Amount (SOL)</span><Input value={amount} onChange={e => { setAmount(e.target.value); setConfirmed(false); }} inputMode="decimal" className="h-12"/></label>{!identity.safeForNativeSol && <p role="alert" className="text-names-warning">This owner is not a safe native SOL destination. Sending is blocked.</p>}<Button disabled={!valid || !identity.safeForNativeSol || confirmed} onClick={() => setConfirmed(true)} className="min-h-11 bg-names-accent text-background hover:bg-names-accent/90">Confirm simulated send</Button>{confirmed && <p role="status" className="text-names-success">Preview complete: send {amount} SOL to {identity.handle}. No transaction was created or submitted.</p>}{payment && <div className="border-t border-border pt-5"><Button variant="outline" asChild><Link to="/pay">Switch to live SolHandle Pay</Link></Button><p className="mt-3 text-xs text-muted-foreground">The live product re-resolves the recipient, connects your wallet and requires a separate review and signature. Enter the recipient and amount there.</p></div>}</div>;
}