import { useMutation, useQueryClient } from '@tanstack/react-query';
import labClient from '@/components/solhandle/network/lab/labClient';
export default function useLabMutation(actorId, onSuccess) {
  const client = useQueryClient();
  return useMutation({ mutationFn: payload => labClient({ ...payload, actorId }), onSuccess: async result => { await client.invalidateQueries({ queryKey: ['network-lab'] }); if (onSuccess) onSuccess(result); } });
}