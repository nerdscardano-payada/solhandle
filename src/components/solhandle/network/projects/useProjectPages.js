import { useInfiniteQuery } from '@tanstack/react-query';
import { rankedProjectPage } from '@/components/solhandle/discover/discoverRanking';

export default function useProjectPages(args = {}) {
  return useInfiniteQuery({
    queryKey: ['network-projects', args], initialPageParam: undefined,
    queryFn: ({ pageParam }) => rankedProjectPage(args, pageParam),
    getNextPageParam: page => page.has_more ? page.next_cursor : undefined,
    staleTime: 0, refetchInterval: 30000, retry: 1
  });
}