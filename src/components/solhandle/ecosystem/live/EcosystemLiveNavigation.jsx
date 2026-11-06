import { Home, Compass, ContactRound, Send, UserRound, Plus, Layers3, ArrowLeftRight } from 'lucide-react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import EcosystemResourceNavigation from '@/components/solhandle/ecosystem/live/EcosystemResourceNavigation';
import AdminEcosystemLinks from '@/components/solhandle/admin/AdminEcosystemLinks';
import { ecosystemAssets } from '@/components/solhandle/ecosystem/live/ecosystemRoutes';
import '@/components/solhandle/ecosystem/live/ecosystem-navigation.css';
const groups = [['Overview', [[Home, 'Dashboard', '/ecosystem']]], ['Identity', [[UserRound, 'My Identity', '/profile'], [Layers3, 'My Handles', '/my-handles']]], ['Network', [[Compass, 'Discover', '/discover'], [ArrowLeftRight, 'Secondary Market', '/names?tab=for-sale'], [ContactRound, 'Contacts', '/contacts']]], ['Payments', [[Send, 'SolHandle Pay', '/pay']]]];
const mobileItems = [[Home, 'Dashboard', '/ecosystem'], [Compass, 'Discover', '/discover'], [ContactRound, 'Contacts', '/contacts'], [Send, 'Pay', '/pay'], [UserRound, 'Identity', '/profile']];
export default function EcosystemLiveNavigation({ mobile = false }) {
  const searchPage = useLocation().pathname === '/search';
  return <aside className={mobile ? 'ep-bottomnav' : 'ep-sidebar'}>
    {!mobile && <p className="ep-eyebrow">YOUR ECOSYSTEM</p>}
    {mobile ? <nav aria-label="Mobile ecosystem navigation">{mobileItems.map(([Icon, label, path]) => <NavLink key={path} to={path} end={path === '/ecosystem'}><Icon size={20}/><span>{label}</span></NavLink>)}</nav> : groups.map(([title, links]) => <section key={title} className="ecosystem-nav-group"><p className="ep-eyebrow">{title}</p><nav aria-label={title}>{links.map(([Icon, label, path]) => <NavLink key={path} to={path} end={path === '/ecosystem'}><Icon size={20}/><span>{label}</span></NavLink>)}</nav></section>)}
    {!mobile && !searchPage && <><Link to="/search" className="ep-button ep-primary ep-claim"><Plus size={18}/>Claim Handle</Link><EcosystemResourceNavigation/><Link to="/upcoming/token-launch" className="ecosystem-secondary-token"><ArrowLeftRight size={16}/>$HANDLE token</Link><AdminEcosystemLinks/><div className="ep-sidebar-city"><Image src={ecosystemAssets.city} alt="" className="ep-city-image" focalPointX={0.82}/><p>Simple Names.<br/>Bigger Possibilities.</p><span className="ep-eyebrow">BUILT AROUND YOU.</span></div><p className="ep-sidebar-status">Solana Mainnet<br/>Your wallet. Your control.</p></>}
  </aside>;
}