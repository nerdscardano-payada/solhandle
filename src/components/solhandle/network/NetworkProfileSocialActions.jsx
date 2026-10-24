import { Loader2 } from 'lucide-react';
import useNetworkParticipation from '@/components/solhandle/network/useNetworkParticipation';

const actions = [['FOLLOW', 'Follow', 'Following', 'Unfollow'], ['BLOCK', 'Block', 'Blocked', 'Unblock'], ['MUTE', 'Mute', 'Muted', 'Unmute']];
export default function NetworkProfileSocialActions({ actorId, profile, change }) {
  const canParticipate = useNetworkParticipation(actorId);
  return <>{actions.map(([kind, label, activeLabel, undoLabel]) => {
    const active = profile.relations.includes(kind);
    const pending = change.isPending && change.variables?.kind === kind;
    return <button key={kind} type="button" disabled={!canParticipate || change.isPending}
      aria-pressed={active} aria-busy={pending} aria-label={`${active ? undoLabel : label} ${profile.name}`}
      onClick={() => change.mutate({ action: 'interact', kind, target: profile.id, active: !active })}
      className={`social-action ${active ? 'border-names-accent text-names-accent' : 'text-identity-muted'}`}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true"/>}{active ? activeLabel : label}
    </button>;
  })}</>;
}