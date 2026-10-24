import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function useHandleMintIdentity(handle) {
  const normalized = typeof handle === 'string' ? handle.replace(/^@+/, '').toLowerCase() : '';
  return useQuery({
    queryKey: ['network-handle-mint', normalized], enabled: Boolean(normalized), retry: false,
    staleTime: 15000, refetchInterval: 60000,
    queryFn: async () => {
      const { data } = await base44.functions.invoke('getHandleIdentity', { handle: normalized });
      if (!data.verified || !data.collectionVerified || data.handle !== `@${normalized}` || !data.assetAddress || !data.address) throw new Error('Handle verification failed.');
      return data;
    }
  });
}