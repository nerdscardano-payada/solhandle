import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import labClient from '@/components/solhandle/network/lab/labClient';
import { useNetworkSession } from '@/components/solhandle/network/NetworkSessionProvider';
export default function useLabMutation(actorId, onSuccess, { requireSession = false } = {}) {
  const client = useQueryClient();
  const session = useNetworkSession();
  const latest = useRef(session);
  const mounted = useRef(true);
  latest.current = session;
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  return useMutation({
    onMutate: () => ({ contextKey: latest.current?.contextKey, actorId: latest.current?.actorId }),
    mutationFn: payload => {
      if (requireSession) {
        const current = latest.current;
        if (!mounted.current || !current?.operator || !actorId || current.actorId !== actorId) throw new Error('Your active Network profile changed. Reopen this action from your current profile.');
        if (payload.action !== 'notificationRead' && !current.ready) throw new Error('Verify your current wallet and handle under Profile → Account management before participating.');
      }
      return labClient({ ...payload, actorId });
    },
    onSuccess: async (result, payload, context) => {
      await client.invalidateQueries({ queryKey: ['network-lab'] });
      const sameContext = latest.current?.contextKey === context?.contextKey && latest.current?.actorId === context?.actorId;
      if (mounted.current && (!requireSession || sameContext) && onSuccess) onSuccess(result);
    }
  });
}