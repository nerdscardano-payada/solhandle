import { useEffect, useState } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

export default function useTokenSupply(tokenMint) {
  const { connection } = useConnection();
  const [supply, setSupply] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (!tokenMint) { setSupply(null); setStatus('unavailable'); return; }
    let mint;
    try { mint = new PublicKey(tokenMint); }
    catch { setSupply(null); setStatus('unavailable'); return; }
    let active = true;
    const load = async () => {
      try {
        const result = await connection.getTokenSupply(mint, 'confirmed');
        if (active) { setSupply(Number(result.value.uiAmountString)); setStatus('live'); }
      } catch {
        if (active) { setSupply(null); setStatus('unavailable'); }
      }
    };
    setStatus('loading');
    load();
    const timer = window.setInterval(load, 60000);
    return () => { active = false; window.clearInterval(timer); };
  }, [connection, tokenMint]);

  return { supply, status };
}