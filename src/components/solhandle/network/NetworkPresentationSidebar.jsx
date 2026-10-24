import { Link } from 'react-router-dom';
import { Plus, UserRound } from 'lucide-react';
import NetworkPresentationNavigation from '@/components/solhandle/network/NetworkPresentationNavigation';
import NetworkSidebarShortcuts from '@/components/solhandle/network/NetworkSidebarShortcuts';
import NetworkGate from '@/components/solhandle/network/NetworkGate';
import { useNetworkSession } from '@/components/solhandle/network/NetworkSessionProvider';
import useProfileIdentity from '@/components/solhandle/profile/useProfileIdentity';

export default function NetworkPresentationSidebar() {
  const session = useNetworkSession();
  const { identity } = useProfileIdentity();
  const label = session.profile?.handle || identity?.primaryHandle || 'My account';
  return <aside className="sd-sidebar"><div className="sd-sidebar-section">YOUR ECOSYSTEM</div><NetworkPresentationNavigation/>{session.operator ? <Link to="/network?compose=1" className="sd-button sd-gradient sd-sidebar-post"><Plus size={17}/> Post</Link> : <NetworkGate action="Create a post"><button className="sd-button sd-gradient sd-sidebar-post" type="button"><Plus size={17}/> Post</button></NetworkGate>}<div className="sd-sidebar-divider"/><NetworkSidebarShortcuts/><Link to="/network/me#account" className="sd-sidebar-account"><span className="sd-avatar sd-avatar-small">{label.replace(/^@/, '').charAt(0).toLowerCase()}</span><span><strong data-no-translate>{label}</strong><small>Identity & account</small></span><UserRound size={16}/></Link></aside>;
}