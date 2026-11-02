import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function useDashboardOwnership(wallet) {
  const client = useQueryClient();
  const query = useQuery({ queryKey: ['dashboard-owned-handles', wallet], enabled: !!wallet, retry: false, staleTime: 0,
    queryFn: async () => {
      const { data } = await base44.functions.invoke('getOwnerHandles', { wallet });
      if (data.error) throw new Error(data.error);
      if (data.wallet !== wallet || !Array.isArray(data.handles)) throw new Error('Ownership could not be checked.');
      return data;
    }
  });
  useEffect(() => {
    const refresh = () => client.invalidateQueries({ queryKey: ['dashboard-owned-handles', wallet] });
    window.addEventListener('solhandle:primary-set', refresh);
    window.addEventListener('solhandle-chain-action-settled', refresh);
    return () => { window.removeEventListener('solhandle:primary-set', refresh); window.removeEventListener('solhandle-chain-action-settled', refresh); };
  }, [wallet, client]);
  return query;
}