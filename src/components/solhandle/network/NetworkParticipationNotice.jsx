import { useNetworkSession } from '@/components/solhandle/network/NetworkSessionProvider';

export default function NetworkParticipationNotice({ actorId = '', className = 'text-xs leading-relaxed text-names-accent' }) {
  const session = useNetworkSession();
  if (session?.ready && session.actorId === actorId) return null;
  let message;
  if (!session?.operator) message = 'Sign in with your Network account to participate.';
  else if (!session.address) message = 'Connect your wallet to continue.';
  else if (session.bootstrap.isError || (session.actorId && session.account.isError)) message = 'Your identity could not be checked. Retry via Identity & account.';
  else if (session.bootstrap.isPending || (session.actorId && (session.account.isPending || session.actorId !== actorId))) message = 'Checking your handle ownership…';
  else if (session.profile?.identityConfigured) message = 'Refresh your handle ownership verification via Identity & account.';
  else if (session.bootstrap.isSuccess && (!session.actorId || session.profile)) message = 'Activate your handle via Identity & account.';
  else message = 'Checking your handle ownership…';
  return <p role="status" className={className}>{message}</p>;
}