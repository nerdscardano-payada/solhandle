import { useCallback, useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

export default function useAdminTrades(userId, limit = 50) {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    if (!userId) return;
    try {
      const rows = await base44.entities.FinancialTransaction.filter({ mint_source: 'native_marketplace', status: 'completed' }, '-timestamp', limit);
      setTrades(rows);
      setError('');
    } catch (err) { setError(err.message || 'Unable to load trades.'); }
    finally { setLoading(false); }
  }, [userId, limit]);
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    load();
    const unsubscribe = base44.entities.FinancialTransaction.subscribe(load);
    const onVisible = () => { if (document.visibilityState === 'visible') load(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { unsubscribe(); document.removeEventListener('visibilitychange', onVisible); };
  }, [userId, load]);
  return { trades, loading, error, refresh: load };
}