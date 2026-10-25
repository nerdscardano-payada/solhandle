import { Pencil } from 'lucide-react';
import NetworkProfileFrame from '@/components/solhandle/network/NetworkProfileFrame';
import LabPrivateImage from '@/components/solhandle/network/lab/LabPrivateImage';
import NetworkProfileShare from '@/components/solhandle/network/NetworkProfileShare';
import NetworkProfileMessageButton from '@/components/solhandle/network/NetworkProfileMessageButton';
import NetworkExternalLink from '@/components/solhandle/network/NetworkExternalLink';
import NetworkRecipientActions from '@/components/solhandle/network/lab/NetworkRecipientActions';
import NetworkProfileSocialActions from '@/components/solhandle/network/NetworkProfileSocialActions';
import NetworkProfilePaymentTools from '@/components/solhandle/network/NetworkProfilePaymentTools';
export default function LabProfileHero({ profile, actorId, change, onList, onEdit, own = false }) {
  return <NetworkProfileFrame profile={profile} onIdentity={() => onList('identity')} label={own ? 'My profile · Private preview' : 'Development profile'}
    banner={profile.banner && <LabPrivateImage media={profile.banner} alt={`${profile.name} banner`} className="sd-profile-banner-image"/>}
    avatar={profile.avatar && <LabPrivateImage media={profile.avatar} alt={`${profile.name} profile picture`} className="sd-profile-avatar-image"/>}
    actions={<>{actorId === profile.id ? <><button type="button" className="sd-button sd-secondary" onClick={onEdit}><Pencil size={15}/> Edit profile</button><NetworkProfilePaymentTools/></> : <><NetworkProfileSocialActions actorId={actorId} profile={profile} change={change} mode="follow"/><NetworkProfileMessageButton/><NetworkRecipientActions actorId={actorId} profile={profile} compact/><NetworkProfileSocialActions actorId={actorId} profile={profile} change={change} mode="more"/></>}</>}
    identity={<div className="network-identity-badges"><span data-active={profile.ownerVerified} title="Ownership only, not trust, KYC or investment endorsement.">{profile.ownerVerified ? 'Current Owner Verified' : 'Owner not currently verified'}</span><span data-active={profile.primaryActive}>{profile.primaryActive ? 'Primary Handle Active' : 'Primary Handle not active'}</span><span data-active={profile.paymentsEnabled}>{profile.paymentsEnabled ? 'Payments enabled' : 'Payments not enabled'}</span></div>}
    meta={<><span>Joined {profile.joinedAt ? new Date(profile.joinedAt).toLocaleDateString('en-US') : 'date unavailable'}</span>{profile.website && <NetworkExternalLink href={profile.website}/>}</>}
    share={<NetworkProfileShare profile={profile} path={`/network?profile=${encodeURIComponent(profile.id)}`}/>}
    counts={<><button type="button" onClick={() => onList('posts')}><strong>{profile.posts}</strong> posts</button><button type="button" onClick={() => onList('followers')}><strong>{profile.followers}</strong> followers</button><button type="button" onClick={() => onList('following')}><strong>{profile.following}</strong> following</button></>}
  ><p>Ownership status uses a short-lived chain check, not a trust score.</p></NetworkProfileFrame>;
}