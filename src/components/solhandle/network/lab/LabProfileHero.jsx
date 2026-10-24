import { Pencil } from 'lucide-react';
import NetworkProfileFrame from '@/components/solhandle/network/NetworkProfileFrame';
import LabPrivateImage from '@/components/solhandle/network/lab/LabPrivateImage';
import NetworkShare from '@/components/solhandle/network/NetworkShare';
import NetworkExternalLink from '@/components/solhandle/network/NetworkExternalLink';
import NetworkRecipientActions from '@/components/solhandle/network/lab/NetworkRecipientActions';
import useNetworkParticipation from '@/components/solhandle/network/useNetworkParticipation';
import NetworkProfilePaymentTools from '@/components/solhandle/network/NetworkProfilePaymentTools';
export default function LabProfileHero({ profile, actorId, change, onList, onEdit, own = false }) {
  const canParticipate = useNetworkParticipation(actorId);
  return <NetworkProfileFrame profile={profile} label={own ? 'My profile · Private preview' : 'Development profile'}
    banner={profile.banner && <LabPrivateImage media={profile.banner} alt={`${profile.name} banner`} className="h-full w-full"/>}
    avatar={profile.avatar && <LabPrivateImage media={profile.avatar} alt={`${profile.name} profile picture`} className="h-full w-full"/>}
    actions={<>{actorId === profile.id && <button type="button" className="social-action social-action-secondary" onClick={onEdit}><Pencil className="h-4 w-4"/>Edit profile</button>}{actorId === profile.id && <NetworkProfilePaymentTools/>}{actorId !== profile.id && ['FOLLOW', 'BLOCK', 'MUTE'].map(kind => <button type="button" key={kind} disabled={!canParticipate || change.isPending} aria-pressed={profile.relations.includes(kind)} onClick={() => change.mutate({ action: 'interact', kind, target: profile.id, active: !profile.relations.includes(kind) })} className={`social-action ${profile.relations.includes(kind) ? 'border-names-accent text-names-accent' : 'text-identity-muted'}`}>{profile.relations.includes(kind) ? `Undo ${kind.toLowerCase()}` : kind.toLowerCase()}</button>)}</>}
    identity={<div className="network-identity-badges"><span data-active={profile.ownerVerified} title="Ownership only, not trust, KYC or investment endorsement.">{profile.ownerVerified ? 'Current Owner Verified' : 'Owner not currently verified'}</span><span data-active={profile.primaryActive}>{profile.primaryActive ? 'Primary Handle Active' : 'Primary Handle not active'}</span><span data-active={profile.paymentsEnabled}>{profile.paymentsEnabled ? 'Payments enabled' : 'Payments not enabled'}</span></div>}
    meta={<><span>Joined {profile.joinedAt ? new Date(profile.joinedAt).toLocaleDateString() : 'date unavailable'}</span>{profile.website && <NetworkExternalLink href={profile.website}/>}</>}
    share={<NetworkShare path={`/network?profile=${profile.id}`} title={`${profile.name} · Network profile`}/>}
    counts={<><button type="button" onClick={() => onList('posts')}><strong>{profile.posts}</strong> posts</button><button type="button" onClick={() => onList('followers')}><strong>{profile.followers}</strong> followers</button><button type="button" onClick={() => onList('following')}><strong>{profile.following}</strong> following</button></>}
  ><p className="mt-3 text-xs text-identity-muted">Ownership status uses a short-lived chain check, not a trust score.</p><div className="mt-3"><NetworkRecipientActions actorId={actorId} profile={profile}/></div></NetworkProfileFrame>;
}