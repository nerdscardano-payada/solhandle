import { useInfiniteQuery } from '@tanstack/react-query';
import labClient from '@/components/solhandle/network/lab/labClient';
export default function useLabList(actorId, args) {
  return useInfiniteQuery({ queryKey: ['network-lab', actorId, args], initialPageParam: undefined, enabled: Boolean(actorId), queryFn: ({ pageParam }) => labClient({ actorId, ...args, cursor: pageParam }), getNextPageParam: page => page.has_more ? page.next_cursor : undefined, retry: 1 });
}