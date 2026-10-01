import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { normalizeHandle, validateHandle } from '@/lib/solhandle';
import useConfirmedHandleSearch from '@/components/solhandle/useConfirmedHandleSearch';

export default function useDiscoverConfirmedSearch(search) {
  const handle = normalizeHandle(search);
  const [settled, setSettled] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setSettled(handle), 700);
    return () => clearTimeout(timer);
  }, [handle]);
  const userEntered = Boolean(handle) && handle === settled && !validateHandle(handle);
  const availability = useQuery({
    queryKey: ['discover-search-availability', settled],
    queryFn: async () => (await base44.functions.invoke('getHandleAvailability', { handle: settled })).data,
    enabled: userEntered, staleTime: 60000, retry: false
  });
  useConfirmedHandleSearch(handle, availability.data, userEntered);
}