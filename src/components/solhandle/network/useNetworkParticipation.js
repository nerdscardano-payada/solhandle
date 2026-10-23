import { useNetworkSession } from '@/components/solhandle/network/NetworkSessionProvider';
export default function useNetworkParticipation(actorId) {
  const session = useNetworkSession();
  return Boolean(session?.ready && session.actorId === actorId);
}