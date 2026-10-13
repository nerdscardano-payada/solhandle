import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DemoLookupForm from '@/components/solhandle/demos/DemoLookupForm';
import DemoPresentation from '@/components/solhandle/demos/DemoPresentation';
import DemoTransformation from '@/components/solhandle/demos/DemoTransformation';
import DemoIntegrationEvidence from '@/components/solhandle/demos/DemoIntegrationEvidence';
import useDemoLookup from '@/components/solhandle/demos/useDemoLookup';
export default function DemoWorkspace({ slug }) {
  const [params, setParams] = useSearchParams(); const reverse = slug === 'reverse-resolver';
  const [input, setInput] = useState(() => reverse ? params.get('address') || '' : params.get('handle') || '@demo');
  const { result, stage, error, lookup, reset } = useDemoLookup();
  const mode = reverse ? 'reverse' : slug === 'partner-mint' ? 'availability' : 'resolve';
  function change(value) { setInput(value); reset(); setParams({ [reverse ? 'address' : 'handle']: value }, { replace: true }); }
  return <div className="space-y-7"><section className="rounded-2xl border border-border bg-card p-5 md:p-7"><h2 className="mb-5 text-xl font-semibold">{reverse ? 'Wallet → primary identity' : slug === 'partner-mint' ? 'Find your @ on Solana' : 'One name. One current owner.'}</h2><DemoLookupForm value={input} onChange={change} onSubmit={() => lookup(input, mode)} onRun={() => lookup(input, mode, true)} stage={stage} error={error} reverse={reverse} label={mode === 'availability' ? 'Check availability' : undefined}/><DemoPresentation slug={slug} input={input} mode={mode} disabled={Boolean(stage)}/><p className="mt-6 text-xs leading-6 text-muted-foreground">{reverse ? 'Paste a real wallet address. No primary handle means no result; a name is never invented.' : '@demo is an example input, not a promise of availability or ownership. Try any registered handle for identity demos.'} Run Demo adds a short recording-friendly sequence; lookup speed depends on Solana.</p></section><DemoTransformation slug={slug} result={result} input={input}/><DemoIntegrationEvidence result={result} input={input} mode={mode}/></div>;
}