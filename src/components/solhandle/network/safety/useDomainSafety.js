import { useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export async function domainSafety(payload) {
  const { data } = await base44.functions.invoke('networkDomainSafety', payload);
  if (data.error) throw new Error(data.error);
  return data;
}
export default function useDomainSafety() {
  const [filter, setFilter] = useState({ hostname: '', classification: '' });
  const client = useQueryClient();
  const history = useInfiniteQuery({ queryKey: ['network-domain-history', filter], initialPageParam: undefined, queryFn: ({ pageParam }) => domainSafety({ action: 'history', ...filter, cursor: pageParam }), getNextPageParam: page => page.has_more ? page.next_cursor : undefined });
  const save = useMutation({ mutationFn: values => domainSafety({ action: 'decide', ...values }), onSuccess: () => client.invalidateQueries({ queryKey: ['network-domain-history'] }) });
  return { filter, setFilter, history, save };
}