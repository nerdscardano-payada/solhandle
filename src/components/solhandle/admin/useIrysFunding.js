import { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';

export default function useIrysFunding() {
  const [data, setData] = useState(null), [proposal, setProposal] = useState(null);
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), [uncertain, setUncertain] = useState(false);
  const locked = useRef(false);
  const invoke = async payload => (await base44.functions.invoke('irysStorageFunding', payload)).data;
  const refresh = async () => {
    const result = await invoke({ action: 'status' });
    setData(result); setUncertain(['executing', 'unknown'].includes(result.status));
  };
  const run = async task => {
    if (locked.current) return;
    locked.current = true; setBusy(true); setError('');
    try { await task(); }
    catch (e) { setError(e.response?.data?.error || e.message || 'Unable to load funding details.'); }
    finally { locked.current = false; setBusy(false); }
  };
  useEffect(() => { run(refresh); }, []);
  const prepare = amount => run(async () => {
    setProposal(null);
    setProposal(await invoke({ action: 'prepare', amount_sol: amount.trim() }));
  });
  const confirm = () => run(async () => {
    if (!proposal) return;
    const request_id = proposal.request_id;
    setProposal(null); setUncertain(true);
    try {
      const result = await invoke({ action: 'confirm', request_id, confirmed: true });
      setData(current => ({ ...current, status: result.status, transaction_id: result.transaction_id || '', message: result.message || 'Deposit submitted. Refresh to check your Irys credit.' }));
      setUncertain(result.status !== 'confirmed');
      await refresh();
    } catch (e) {
      setError(e.response?.data?.error || 'The response could not be confirmed. Refresh the balances before doing anything else.');
      // Only unlock when the server confirms no deposit is executing or uncertain.
      await refresh().catch(() => setUncertain(true));
    }
  });
  return { data, proposal, busy, error, blocked: uncertain || ['executing', 'unknown'].includes(data?.status), refresh: () => run(refresh), prepare, confirm, cancel: () => setProposal(null) };
}