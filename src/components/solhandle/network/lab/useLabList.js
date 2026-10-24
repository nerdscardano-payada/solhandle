import { useInfiniteQuery } from '@tanstack/react-query';
import labClient from '@/components/solhandle/network/lab/labClient';
import { useNetworkSession } from '@/components/solhandle/network/NetworkSessionProvider';
export default function useLabList(actorId, args) {
  const session = useNetworkSession();
  return useInfiniteQuery({ queryKey: ['network-lab', actorId, session?.contextKey, args], initialPageParam: undefined, enabled: Boolean(session?.operator && actorId && session.actorId === actorId), queryFn: ({ pageParam }) => labClient({ actorId, ...args, cursor: pageParam }), getNextPageParam: page => page.has_more ? page.next_cursor : undefined, retry: 1, refetchInterval: args.action === 'notifications' ? 20000 : false });
}