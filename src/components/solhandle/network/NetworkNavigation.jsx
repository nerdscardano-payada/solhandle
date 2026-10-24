import { Link, useLocation } from 'react-router-dom';
import { House, Compass, Users, Bell, UserRound } from 'lucide-react';
const entries = [[House, 'Home', '/network'], [Compass, 'Discover', '/network/discover'], [Users, 'My network', '/network/connections'], [Bell, 'Notifications', '/network/notifications'], [UserRound, 'Profile', '/network/me']];
export default function NetworkNavigation() {
  const { pathname, search } = useLocation();
  const params = new URLSearchParams(search);
  const selected = pathname === '/network/me' || (pathname === '/network' && params.get('view') === 'profile') ? '/network/me' : ['/network/search', '/network/discover'].includes(pathname) ? '/network/discover' : ['/network/connections', '/network/notifications'].includes(pathname) ? pathname : '/network';
  const items = entries.map(([Icon, name, path]) => <Link key={name} to={path} aria-label={name} aria-current={selected === path ? 'page' : undefined} className={`network-nav-item ${selected === path ? 'network-nav-active' : ''}`}><Icon className="h-5 w-5 shrink-0"/><span>{name}</span></Link>);
  return <><nav aria-label="Main social navigation" className="social-primary-nav">{items}</nav><nav aria-label="Mobile social navigation" className="social-bottom-nav">{items}</nav></>;
}