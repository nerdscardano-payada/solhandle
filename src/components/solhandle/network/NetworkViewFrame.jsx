import { Link } from 'react-router-dom';
import { Users, Fingerprint, Send } from 'lucide-react';
import NetworkHomeLayout from '@/components/solhandle/design/NetworkHomeLayout';
import NetworkLiveContextCards from '@/components/solhandle/network/NetworkLiveContextCards';
import NetworkSectionHeader from '@/components/solhandle/network/NetworkSectionHeader';
import NetworkPayPanel from '@/components/solhandle/network/NetworkPayPanel';
import useProfileIdentity from '@/components/solhandle/profile/useProfileIdentity';

export default function NetworkViewFrame({ home, title, children }) {
  const { identity } = useProfileIdentity();
  if (!home) return <><NetworkSectionHeader title={title}/>{children}</>;
  const handle = identity?.primaryHandle || 'Choose your @handle';
  return <div className="sd-network-home"><header className="sd-page-title"><div><span className="sd-eyebrow">YOUR SOLHANDLE</span><h1>Good to see you<span className="sd-title-dot">.</span></h1><p>Your network. Your name. All connected.</p></div><span className="sd-small-status"><span className="sd-status-dot"/> Public Network</span></header><NetworkHomeLayout context={<NetworkLiveContextCards/>} mobileActions={<><Link to="/network/me" className="sd-mobile-identity"><span className="sd-avatar">{handle.replace(/^@/, '').charAt(0).toLowerCase()}</span><div><small>YOUR IDENTITY</small><strong data-no-translate>{handle}</strong></div><Fingerprint size={19}/></Link><NetworkPayPanel><button className="sd-button sd-gradient"><Send size={16}/> Pay</button></NetworkPayPanel></>}><div className="sd-feed-panel"><header className="sd-network-social-title"><span><Users size={18}/><strong>Social</strong></span><small>Your timeline</small></header>{children}</div></NetworkHomeLayout></div>;
}