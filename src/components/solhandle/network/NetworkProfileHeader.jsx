import NetworkProfileFrame from '@/components/solhandle/network/NetworkProfileFrame';
import NetworkGate from '@/components/solhandle/network/NetworkGate';
import NetworkProfileShare from '@/components/solhandle/network/NetworkProfileShare';
export default function NetworkProfileHeader({ profile, onIdentity }) {
  return <NetworkProfileFrame profile={profile} label="Operator preview" onIdentity={onIdentity}
    actions={<NetworkGate action={`Follow ${profile.name}`}><button className="social-action social-action-primary">Follow</button></NetworkGate>}
    identity={<div className="network-identity-badges"><span>No verified handle binding</span><span>Primary Handle not active</span></div>}
    share={<NetworkProfileShare profile={profile}/>}
    counts={<><span><strong>{profile.posts}</strong> posts</span><span><strong>{profile.replies}</strong> replies</span><span>Followers / following not enabled</span></>}
  />;
}