import { useQuery } from '@tanstack/react-query';
import invokeWithRetry from '@/lib/invokeWithRetry';

export default function RotatingHomeName({ handle, onSelect }) {
  const { data, isPending } = useQuery({
    queryKey: ['home-handle-status', handle],
    queryFn: async () => (await invokeWithRetry('getHandleAvailability', { handle })).data,
    staleTime: 60000
  });
  if (isPending) return <div className="h-10 animate-pulse rounded-xl bg-names-accent/5" aria-label="Loading handle status"/>;
  const label = data?.status === 'CLAIMED' ? 'Claimed' : data?.available === true ? 'Available' : null;
  if (!label) return null;
  return <button type="button" onClick={() => onSelect(handle)} className="home-name-tile text-left">
    <div className="flex items-center justify-between gap-2"><span className="min-w-0 truncate text-lg font-bold">@{handle}</span>
    <b className={label === 'Available' ? 'shrink-0 text-[10px] font-medium text-names-success' : 'shrink-0 text-[10px] font-medium text-names-secondary'}>{label}</b></div>
  </button>;
}