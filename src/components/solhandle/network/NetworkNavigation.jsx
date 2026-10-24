import { Link, useLocation } from 'react-router-dom';
import { House, Compass, Users, MessageCircle, UserRound } from 'lucide-react';
const entries = [[House, 'Home', '/network'], [Compass, 'Discover', '/network/discover'], [Users, 'My network', '/network/connections'], [MessageCircle, 'Messages', null], [UserRound, 'Profile', '/network/me']];
export default function NetworkNavigation() {
  const { pathname, search } = useLocation();
  const params = new URLSearchParams(search);
  const selected = pathname === '/network/me' || (pathname === '/network' && params.get('view') === 'profile') ? '/network/me' : ['/network/search', '/network/discover'].includes(pathname) ? '/network/discover' : pathname === '/network/connections' ? pathname : '/network';
  const items = entries.map(([Icon, name, path]) => path ? <Link key={name} to={path} aria-label={name} aria-current={selected === path ? 'page' : undefined} className={`network-nav-item ${selected === path ? 'network-nav-active' : ''}`}><Icon className="h-5 w-5 shrink-0"/><span>{name}</span></Link> : <button type="button" key={name} disabled aria-label="Messages, not available yet" title="Private and group conversations are not active services." className="network-nav-item"><Icon className="h-5 w-5 shrink-0"/><span>{name}</span><small>Planned</small></button>);
  return <><nav aria-label="Main social navigation" className="social-primary-nav">{items}</nav><nav aria-label="Mobile social navigation" className="social-bottom-nav">{items}</nav></>;
}