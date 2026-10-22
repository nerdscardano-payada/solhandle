import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function useProfileIdentity() {
  const { publicKey } = useWallet();
  const address = publicKey?.toBase58() || '';
  const client = useQueryClient();
  const query = useQuery({
    queryKey: ['profile-identity', address], enabled: !!address, retry: false, staleTime: 30000,
    queryFn: async () => {
      try {
        const { data } = await base44.functions.invoke('reverseResolveSolHandle', { address });
        if (data.error) throw new Error(data.error);
        if (data.address !== address || !data.verified || !data.primaryHandle || !data.assetAddress) throw new Error('Identity could not be verified.');
        return { ...data, checkedAt: new Date().toISOString() };
      } catch (error) {
        if (error.response?.status === 404 || error.status === 404) return null;
        throw error;
      }
    },
  });
  useEffect(() => {
    const refresh = () => client.invalidateQueries({ queryKey: ['profile-identity', address] });
    window.addEventListener('solhandle:primary-set', refresh);
    window.addEventListener('solhandle-chain-action-settled', refresh);
    return () => { window.removeEventListener('solhandle:primary-set', refresh); window.removeEventListener('solhandle-chain-action-settled', refresh); };
  }, [address, client]);
  return { address, identity: query.data, loading: !!address && query.isPending, refreshing: query.isFetching, error: query.isError, refresh: query.refetch };
}