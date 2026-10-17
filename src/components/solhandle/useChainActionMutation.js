import { useMutation, useQueryClient } from '@tanstack/react-query';
const affected = ['handle-availability', 'owner-handles', 'names', 'market-page', 'market-stats', 'home-name-listing', 'recent-handles', 'homepage-recent-mints', 'market-notifications', 'notification-owner'];
export default function useChainActionMutation() {
  const client = useQueryClient();
  const remove = context => {
    if (context) client.setQueryData(['pending-chain-actions', context.wallet], rows => (rows || []).filter(row => row.id !== context.id));
  };
  return useMutation({
    mutationKey: ['chain-action'],
    retry: false,
    mutationFn: ({ execute }) => execute(),
    onMutate: async ({ action, handle, wallet, amount }) => {
      const key = ['pending-chain-actions', wallet];
      await client.cancelQueries({ queryKey: key });
      const id = crypto.randomUUID();
      client.setQueryData(key, rows => [...(rows || []), { id, action, handle, wallet, amount, status: 'pending' }]);
      return { id, wallet };
    },
    onError: (_error, _variables, context) => remove(context),
    onSettled: (_data, _error, variables, context) => {
      remove(context);
      client.invalidateQueries({ predicate: query => affected.includes(query.queryKey[0]) });
      window.dispatchEvent(new CustomEvent('solhandle-chain-action-settled', { detail: { wallet: variables.wallet } }));
    },
  });
}