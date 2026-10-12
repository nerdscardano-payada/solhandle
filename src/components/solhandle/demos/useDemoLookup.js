import { useEffect, useRef, useState } from 'react';
import { resolveHandle, reverseResolve, checkAvailability, executeSdk, demoError } from '@/components/solhandle/demos/demoCore';
export default function useDemoLookup() {
  const [result, setResult] = useState(null), [error, setError] = useState(''), [stage, setStage] = useState('');
  const generation = useRef(0);
  useEffect(() => () => { generation.current++; }, []);
  const reset = () => { generation.current++; setResult(null); setError(''); setStage(''); };
  async function lookup(input, mode = 'resolve', animated = false, rpcUrl = '') {
    const ticket = ++generation.current; const active = () => generation.current === ticket;
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    setResult(null); setError(''); setStage(animated ? 'Checking input…' : 'Resolving on Solana…');
    try {
      if (animated) { await wait(2000); if (!active()) return; setStage('Resolving on Solana…'); }
      const data = await (rpcUrl ? executeSdk(input, mode, rpcUrl) : mode === 'reverse' ? reverseResolve(input) : mode === 'availability' ? checkAvailability(input) : resolveHandle(input));
      if (animated) { await wait(4000); if (!active()) return; }
      if (active()) { setResult(data); setStage(''); }
    } catch (e) { if (active()) { setError(demoError(e)); setStage(''); } }
  }
  return { result, error, stage, lookup, reset };
}