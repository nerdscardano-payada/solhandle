import { useState } from 'react';
import { Users, ArrowUpRight, Fingerprint, Send } from 'lucide-react';
import { useDesign } from '@/components/solhandle/design/DesignContext';
import EcosystemCards from '@/components/solhandle/design/EcosystemCards';
import PreviewFeed from '@/components/solhandle/design/PreviewFeed';
import '@/components/solhandle/design/network-section-headings.css';
import NetworkHomeLayout from '@/components/solhandle/design/NetworkHomeLayout';
export default function NetworkHomeContent() {
  const d = useDesign();
  const [tab, setTab] = useState('all');
  return <NetworkHomeLayout mobileActions={<><button className="sd-mobile-identity" onClick={() => d.setDialog('identity')}><span className="sd-avatar">a</span><div><small>YOUR IDENTITY</small><strong>{d.handle || 'Choose your @handle'}</strong></div><Fingerprint size={19}/></button><button className="sd-button sd-gradient" onClick={() => d.setDialog('pay')}><Send size={16}/> Pay</button></>} context={<><EcosystemCards cinematic sections={['identity', 'pay']}/><div className="sd-discovery"><span className="sd-eyebrow">MAKE CONNECTIONS</span><h3>Built to move forward together.</h3><p>Discover people and projects that expand your world.</p><button className="sd-text-button" onClick={() => d.go('network')}>View your network <ArrowUpRight size={15}/></button><small>All profiles and counts in this design are fictional.</small></div></>}><div className="sd-feed-panel"><header className="sd-network-social-title"><span><Users size={18}/><strong>Social</strong></span><small>Your timeline</small></header><nav className="sd-feed-tabs" aria-label="Example timeline"><button aria-pressed={tab === 'all'} onClick={() => setTab('all')}>For you</button><button aria-pressed={tab === 'following'} onClick={() => setTab('following')}>Following</button></nav>{tab === 'following' && !d.following ? <div className="sd-empty"><h3>Your network starts with one connection.</h3><p>Follow an example profile to preview this state.</p><button className="sd-button sd-secondary" onClick={() => d.go('profile')}>Discover Ansem <ArrowUpRight size={15}/></button></div> : <PreviewFeed cinematic/>}</div></NetworkHomeLayout>;
}