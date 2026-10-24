import { Loader2, MoreHorizontal } from 'lucide-react';
import useNetworkParticipation from '@/components/solhandle/network/useNetworkParticipation';

const actions = [['FOLLOW', 'Follow', 'Following', 'Unfollow'], ['BLOCK', 'Block', 'Blocked', 'Unblock'], ['MUTE', 'Mute', 'Muted', 'Unmute']];
export default function NetworkProfileSocialActions({ actorId, profile, change, mode = 'all' }) {
  const canParticipate = useNetworkParticipation(actorId);
  const renderAction = ([kind, label, activeLabel, undoLabel]) => {
    const active = profile.relations.includes(kind);
    const pending = change.isPending && change.variables?.kind === kind;
    return <button key={kind} type="button" disabled={!canParticipate || change.isPending} aria-pressed={active} aria-busy={pending} aria-label={`${active ? undoLabel : label} ${profile.name}`} onClick={() => change.mutate({ action: 'interact', kind, target: profile.id, active: !active })} className={`sd-button ${kind === 'FOLLOW' && !active ? 'sd-gradient' : 'sd-secondary'}`}>{pending && <Loader2 size={15} className="animate-spin" aria-hidden="true"/>}{active ? activeLabel : label}</button>;
  };
  return <>{mode !== 'more' && renderAction(actions[0])}{mode !== 'follow' && <details className="sd-profile-action-more"><summary className="sd-button sd-secondary" aria-label="More profile actions"><MoreHorizontal size={17}/></summary><div>{actions.slice(1).map(renderAction)}</div></details>}</>;
}