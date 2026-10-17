import { useCallback, useEffect, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { base44 } from '@/api/base44Client';
import { authorizedPayments, paymentAuthorization } from '@/lib/payAuth';
export default function usePaymentRequests(revision) {
  const { publicKey, signMessage } = useWallet(), wallet = publicKey?.toBase58() || '';
  const [page, setPage] = useState(null), [filter, setFilter] = useState('ALL'), [busy, setBusy] = useState(false), [error, setError] = useState(''), [expired, setExpired] = useState(false);
  const proof = useRef(null), generation = useRef(0), activeWallet = useRef(wallet); activeWallet.current = wallet;
  useEffect(() => { proof.current = null; generation.current++; setPage(null); setError(''); setExpired(false); setBusy(false); }, [wallet]);
  const historyCall = useCallback(async (action, extra = {}, prompt = true) => {
    let auth = proof.current;
    if (auth?.wallet !== wallet || Date.now() - auth.timestamp > 240000) {
      if (!prompt) { setExpired(true); return null; }
      auth = await paymentAuthorization('requests', publicKey, signMessage); if (activeWallet.current !== wallet) return null; proof.current = auth;
    }
    return (await base44.functions.invoke('payRecords', { action, ...auth, ...extra })).data;
  }, [wallet, publicKey, signMessage]);
  const load = useCallback(async (cursor = '', prompt = true) => {
    if (!wallet || !signMessage) return;
    const run = ++generation.current; setBusy(true); setError('');
    try { const data = await historyCall('requests', { filter, ...(cursor ? { cursor } : {}) }, prompt); if (run === generation.current && activeWallet.current === wallet && data) { setPage(current => ({ ...data, items: cursor ? [...(current?.items || []), ...data.items] : data.items })); setExpired(false); } }
    catch (e) { if (run === generation.current) setError(e.response?.data?.error || e.message || 'Could not load requests.'); }
    finally { if (run === generation.current) setBusy(false); }
  }, [wallet, signMessage, filter, historyCall]);
  useEffect(() => { if (proof.current?.wallet === wallet) load('', false); }, [filter, revision, wallet, load]);
  useEffect(() => { if (!page) return; const timer = setInterval(() => { if (!document.hidden && !busy) load('', false); }, 30000); return () => clearInterval(timer); }, [Boolean(page), busy, load]);
  const cancel = async requestId => {
    const owner = wallet; setBusy(true); setError('');
    try { await authorizedPayments('cancel_request', publicKey, signMessage, { requestId }); if (activeWallet.current === owner) await load(); }
    catch (e) { if (activeWallet.current === owner) setError(e.response?.data?.error || e.message); }
    finally { if (activeWallet.current === owner) setBusy(false); }
  };
  return { wallet, signMessage, page, busy, error, expired, filter, setFilter, load, cancel, historyCall };
}