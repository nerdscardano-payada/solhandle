import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { contactRequest } from '@/components/solhandle/contacts/contactClient';
import useContactsAccess from '@/components/solhandle/contacts/useContactsAccess';
export default function useContacts(search = '') {
  const access = useContactsAccess(), client = useQueryClient();
  const query = useInfiniteQuery({
    queryKey: ['wallet-contacts', access.wallet, access.session?.expires_at, search],
    enabled: !!access.unlocked,
    initialPageParam: null,
    queryFn: ({ pageParam }) => contactRequest('list', access.wallet, { search, ...(pageParam ? { cursor: pageParam } : {}) }),
    getNextPageParam: page => page.has_more ? page.next_cursor : undefined,
    refetchInterval: 15000, refetchOnWindowFocus: 'always', refetchOnReconnect: 'always', retry: false,
  });
  return { ...access, query, contacts: access.unlocked ? query.data?.pages.flatMap(page => page.items) || [] : [], refresh: () => client.invalidateQueries({ queryKey: ['wallet-contacts', access.wallet] }) };
}