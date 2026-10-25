import { useInfiniteQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { projectFields, projectQuery } from '@/components/solhandle/network/projects/projectDirectory';

export default function useProjectPages(args = {}) {
  return useInfiniteQuery({
    queryKey: ['network-projects', args], initialPageParam: undefined,
    queryFn: ({ pageParam }) => base44.entities.NetworkProject.filter(projectQuery(args), { sort: 'name', limit: args.limit || 20, fields: projectFields, ...(pageParam ? { cursor: pageParam } : {}) }),
    getNextPageParam: page => page.has_more ? page.next_cursor : undefined,
    staleTime: 0, refetchInterval: 30000, retry: 1
  });
}