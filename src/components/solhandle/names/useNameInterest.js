import { useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { base44 } from '@/api/base44Client';
import { authorizeNamesWallet, namesProof } from '@/components/solhandle/names/namesWallet';
export default function useNameInterest(handle) {
  const { publicKey, signMessage } = useWallet(), { setVisible } = useWalletModal();
  const wallet = publicKey?.toBase58() || '', client = useQueryClient();
  const pending = useRef(false);
  const queryKey = ['name-interest', handle, wallet];
  const query = useQuery({ queryKey, queryFn: async () => (await base44.functions.invoke('namesWatch', { action: 'detail', handle, proof: namesProof(wallet) })).data, staleTime: 60000, retry: false });
  useEffect(() => {
    const refresh = () => { if (!pending.current) client.invalidateQueries({ queryKey: ['name-interest', handle, wallet] }); };
    window.addEventListener('solhandle:names-authorized', refresh);
    return () => window.removeEventListener('solhandle:names-authorized', refresh);
  }, [client, handle, wallet]);
  const mutation = useMutation({
    mutationFn: async ({ watching }) => {
      const proof = await authorizeNamesWallet(publicKey, signMessage);
      return (await base44.functions.invoke('namesWatch', { action: 'set', handle, watching, proof })).data;
    },
    onMutate: async ({ watching }) => {
      pending.current = true;
      await client.cancelQueries({ queryKey, exact: true });
      const previous = client.getQueryData(queryKey);
      client.setQueryData(queryKey, current => current ? { ...current, watching, watchers: Math.max(0, current.watchers + (watching ? 1 : -1)) } : current);
      return { previous, queryKey };
    },
    onError: (_error, _variables, context) => { if (context?.previous) client.setQueryData(context.queryKey, context.previous); },
    onSuccess: (next, _variables, context) => {
      client.setQueryData(context.queryKey, next);
      window.dispatchEvent(new CustomEvent('solhandle:names-changed', { detail: handle }));
    },
    onSettled: (_data, _error, _variables, context) => {
      pending.current = false;
      return Promise.all([client.invalidateQueries({ queryKey: context?.queryKey || queryKey, exact: true }), client.invalidateQueries({ queryKey: ['names'] })]);
    }
  });
  const toggle = () => {
    if (!wallet) { setVisible(true); return; }
    if (pending.current || mutation.isPending) return;
    mutation.mutate({ watching: !query.data?.watching });
  };
  return { ...query, busy: mutation.isPending, actionError: mutation.error ? mutation.error.response?.data?.error || mutation.error.message || 'Watchlist could not be updated.' : '', toggle, wallet };
}