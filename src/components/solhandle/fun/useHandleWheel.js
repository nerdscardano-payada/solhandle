import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import invokeWithRetry from '@/lib/invokeWithRetry';

const random = () => crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296;
export default function useHandleWheel() {
  const [rotation, setRotation] = useState(0), [phase, setPhase] = useState('idle');
  const [selected, setSelected] = useState(null), [winner, setWinner] = useState(null);
  const query = useQuery({
    queryKey: ['fun-wheel-names'], staleTime: 60000, retry: false,
    queryFn: async () => {
      const { data } = await invokeWithRetry('discoverNames', { tab: 'available', rank: 'searches' });
      return (data.items || []).map(item => ({ ...item, order: random() })).sort((a, b) => a.order - b.order).slice(0, 8);
    }
  });
  const verification = useMutation({
    mutationFn: async handle => {
      const { data } = await invokeWithRetry('getHandleAvailability', { handle });
      if (data.handle !== handle || !data.available || data.status !== 'AVAILABLE') throw new Error('This name is no longer available. Spin again for another name.');
      return data;
    },
    onSuccess: data => { setWinner(data); setPhase('idle'); },
    onError: () => { setPhase('idle'); query.refetch(); }
  });
  const spin = () => {
    if (phase !== 'idle' || query.isFetching || !query.data?.length) return;
    const index = Math.floor(random() * query.data.length);
    setSelected(query.data[index].handle); setWinner(null); verification.reset(); setPhase('spinning');
    setRotation(value => Math.floor(value / 360) * 360 + 1800 + 360 - (index + 0.5) * 360 / query.data.length);
  };
  const finish = () => {
    if (phase !== 'spinning') return;
    setPhase('checking'); verification.mutate(selected);
  };
  return { names: query.data || [], rotation, phase, winner, spin, finish, loading: query.isLoading,
    refreshing: query.isFetching, error: query.error || verification.error, reload: () => { setWinner(null); verification.reset(); query.refetch(); } };
}