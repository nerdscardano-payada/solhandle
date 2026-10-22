import { useInfiniteQuery } from '@tanstack/react-query';
import { networkRead } from '@/components/solhandle/network/networkClient';
export default function useNetworkPages(action, args = {}, enabled = true) {
  return useInfiniteQuery({ queryKey: ['network', action, args], initialPageParam: undefined, queryFn: ({ pageParam }) => networkRead({ action, ...args, cursor: pageParam }), getNextPageParam: page => page.has_more ? page.next_cursor : undefined, enabled, staleTime: 15000, retry: 1 });
}