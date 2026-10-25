import { Home, Compass, ContactRound, Send, UserRound, Plus, Layers3, ArrowLeftRight } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import { ecosystemAssets } from '@/components/solhandle/ecosystem/live/ecosystemRoutes';
const items = [[Home, 'Home', '/ecosystem'], [Compass, 'Discover', '/discover'], [ContactRound, 'Contacts', '/contacts'], [Send, 'Pay', '/pay'], [UserRound, 'Profile', '/profile'], [ArrowLeftRight, 'Trade $HANDLE', '/upcoming/token-launch']];
export default function EcosystemLiveNavigation({ mobile = false }) {
  return <aside className={mobile ? 'ep-bottomnav' : 'ep-sidebar'}>
    {!mobile && <p className="ep-eyebrow">YOUR ECOSYSTEM</p>}
    <nav aria-label={mobile ? 'Mobile ecosystem navigation' : 'Ecosystem navigation'}>{(mobile ? items.slice(0, 5) : items).map(([Icon, label, path]) => <NavLink key={path} to={path} end={path === '/ecosystem'}><Icon size={20}/><span>{label}</span></NavLink>)}</nav>
    {!mobile && <><Link to="/search" className="ep-button ep-primary ep-claim"><Plus size={18}/>Claim Handle</Link><Link to="/my-handles" className="ep-link el-manage"><Layers3 size={16}/>My Handles</Link><div className="ep-sidebar-city"><Image src={ecosystemAssets.city} alt="" className="ep-city-image" focalPointX={0.82}/><p>Simple Names.<br/>Bigger Possibilities.</p><span className="ep-eyebrow">BUILT AROUND YOU.</span></div><p className="ep-sidebar-status">Solana Mainnet<br/>Your wallet. Your control.</p></>}
  </aside>;
}