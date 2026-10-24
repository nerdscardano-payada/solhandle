import NetworkProfileFrame from '@/components/solhandle/network/NetworkProfileFrame';
import NetworkGate from '@/components/solhandle/network/NetworkGate';
import NetworkProfileShare from '@/components/solhandle/network/NetworkProfileShare';
import NetworkProfileMessageButton from '@/components/solhandle/network/NetworkProfileMessageButton';
import NetworkProfileDialog from '@/components/solhandle/network/NetworkProfileDialog';
import { Send } from 'lucide-react';
export default function NetworkProfileHeader({ profile, onIdentity }) {
  return <NetworkProfileFrame profile={profile} label="Operator preview" onIdentity={onIdentity}
    actions={<><NetworkGate action={`Follow ${profile.name}`}><button type="button" className="sd-button sd-gradient">Follow</button></NetworkGate><NetworkProfileMessageButton/><NetworkProfileDialog title="Pay requires a verified handle" description="This profile has no currently verified payment destination. No wallet address is inferred from its name, and no payment has been started." trigger={<button type="button" className="sd-button sd-secondary"><Send size={16}/> Pay</button>}/></>}
    identity={<div className="network-identity-badges"><span>No verified handle binding</span><span>Primary Handle not active</span></div>}
    share={<NetworkProfileShare profile={profile}/>}
    counts={<><span><strong>{profile.posts}</strong> posts</span><span><strong>{profile.replies}</strong> replies</span><span>Followers / following not enabled</span></>}
  />;
}