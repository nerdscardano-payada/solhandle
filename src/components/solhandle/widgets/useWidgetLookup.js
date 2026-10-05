import { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
export default function useWidgetLookup(type, wallet = '') {
  const [input, setInput] = useState(wallet);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const request = useRef(0);
  async function lookup(value = input) {
    const id = ++request.current;
    const normalized = type === 'identity' ? value.trim() : value.trim().replace(/^@+/, '').toLowerCase();
    setResult(null); setError('');
    if (!(type === 'identity' ? /^[1-9A-HJ-NP-Za-km-z]{32,44}$/ : /^[a-z0-9]{1,20}$/).test(normalized)) {
      setLoading(false); setError(type === 'identity' ? 'Enter a valid Solana wallet address.' : 'Use 1–20 letters or numbers.'); return;
    }
    setLoading(true);
    try {
      const name = type === 'search' ? 'getHandleAvailability' : type === 'lookup' ? 'resolveSolHandle' : 'reverseResolveSolHandle';
      const { data } = await base44.functions.invoke(name, type === 'identity' ? { address: normalized } : { handle: normalized });
      if (id !== request.current) return;
      if (type !== 'search' && (!data.verified || data.network !== 'mainnet-beta' || (type === 'identity' && data.address !== normalized))) throw new Error('Unable to verify this identity.');
      if (type === 'search' && (data.handle !== normalized || data.state || !['AVAILABLE', 'CLAIMED', 'RESERVED', 'PROTECTED'].includes(data.status))) throw new Error('Availability could not be verified. Please try again.');
      setResult({ ...data, handle: normalized });
    } catch (caught) {
      if (id !== request.current) return;
      if (type === 'identity' && caught.response?.status === 404) setResult({ address: normalized, noName: true });
      else setError(caught.response?.status === 404 ? 'No claimed SolHandle found.' : 'Lookup unavailable. Check your input and try again.');
    } finally { if (id === request.current) setLoading(false); }
  }
  useEffect(() => { setInput(wallet); if (type === 'identity' && wallet) lookup(wallet); return () => { request.current++; }; }, [type, wallet]);
  function change(value) { request.current++; setInput(value); setResult(null); setError(''); setLoading(false); }
  return { input, change, result, error, loading, lookup };
}