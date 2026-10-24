import useLabMutation from '@/components/solhandle/network/lab/useLabMutation';

export default function useNetworkSocialMutation(actorId, onSuccess) {
  return useLabMutation(actorId, onSuccess, { requireSession: true });
}