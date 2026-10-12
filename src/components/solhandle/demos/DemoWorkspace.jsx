import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DemoLookupForm from '@/components/solhandle/demos/DemoLookupForm';
import DemoResult from '@/components/solhandle/demos/DemoResult';
import useDemoLookup from '@/components/solhandle/demos/useDemoLookup';
export default function DemoWorkspace({ slug }) {
  const [params, setParams] = useSearchParams(); const reverse = slug === 'reverse-resolver';
  const [input, setInput] = useState(() => reverse ? params.get('address') || '' : params.get('handle') || '@demo');
  const { result, stage, error, lookup, reset } = useDemoLookup();
  const mode = reverse ? 'reverse' : slug === 'partner-mint' ? 'availability' : 'resolve';
  function change(value) { setInput(value); reset(); setParams({ [reverse ? 'address' : 'handle']: value }, { replace: true }); }
  return <div className="grid items-start gap-6 md:grid-cols-2"><section className="rounded-2xl border border-border bg-card p-5 md:p-7"><h2 className="mb-5 text-xl font-semibold">{reverse ? 'Wallet → primary identity' : slug === 'partner-mint' ? 'Find your @ on Solana' : 'One name. One current owner.'}</h2><DemoLookupForm value={input} onChange={change} onSubmit={() => lookup(input, mode)} onRun={() => lookup(input, mode, true)} stage={stage} error={error} reverse={reverse} label={mode === 'availability' ? 'Check availability' : undefined}/><p className="mt-6 text-xs leading-6 text-muted-foreground">{reverse ? 'Paste a real wallet address. No primary handle means no result; a name is never invented.' : '@demo is an example input, not a promise of availability or ownership. Try any registered handle for identity demos.'} Run Demo adds a short recording-friendly sequence; lookup speed depends on Solana.</p></section><section aria-live="polite" className="min-w-0 rounded-2xl border border-names-accent/20 bg-card p-5 md:p-7">{result ? <DemoResult slug={slug} result={result}/> : <div className="py-14 text-center"><p className="text-4xl font-semibold text-names-accent">{reverse ? '@handle' : '@demo'}</p><p className="mt-4 text-sm text-muted-foreground">{stage || 'Run a lookup to see the real result here.'}</p></div>}</section></div>;
}