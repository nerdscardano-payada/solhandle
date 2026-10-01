import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

export default function useTokenSupply(tokenMint) {
  const [supply, setSupply] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (!tokenMint) { setSupply(null); setStatus('unavailable'); return; }
    let active = true;
    const load = async () => {
      try {
        const { data } = await base44.functions.invoke('getTokenSupply', { tokenMint });
        if (!Number.isFinite(data.supply)) throw new Error('Supply data unavailable.');
        if (active) { setSupply(data.supply); setStatus('live'); }
      } catch {
        if (active) { setSupply(null); setStatus('unavailable'); }
      }
    };
    setStatus('loading');
    load();
    const timer = window.setInterval(load, 60000);
    return () => { active = false; window.clearInterval(timer); };
  }, [tokenMint]);

  return { supply, status };
}