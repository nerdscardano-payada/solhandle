import { useEffect, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useDemoLookup from '@/components/solhandle/demos/useDemoLookup';
export default function DemoCounterpartyLookup({ role, onIdentity }) {
  const [input, setInput] = useState('');
  const { result, error, stage, lookup, reset } = useDemoLookup();
  useEffect(() => { onIdentity(result); }, [result, onIdentity]);
  return <form className="space-y-3 rounded-xl border border-border p-4" onSubmit={event => { event.preventDefault(); onIdentity(null); lookup(input); }}><label className="block space-y-2 text-sm"><span>{role} @handle</span><Input value={input} placeholder="@demo" onChange={event => { setInput(event.target.value); onIdentity(null); reset(); }} required className="min-h-11"/></label><Button variant="outline" className="min-h-11" type="submit" disabled={Boolean(stage) || !input.trim()}>{stage ? <LoaderCircle className="animate-spin"/> : null}{stage ? 'Resolving on Solana…' : `Resolve ${role.toLowerCase()}`}</Button>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<p className="text-xs leading-6 text-muted-foreground">Independent live lookup. This does not connect or authenticate the counterparty.</p></form>;
}