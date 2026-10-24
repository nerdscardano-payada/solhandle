import { useLocation, useNavigate } from 'react-router-dom';
import { House, Compass, Users, Bell, UserRound } from 'lucide-react';
const entries = [[House, 'Home', '/network'], [Compass, 'Discover', '/network/discover'], [Users, 'My network', '/network/connections'], [Bell, 'Notifications', '/network/notifications'], [UserRound, 'Profile', '/network/me']];

export default function NetworkPresentationNavigation({ bottom = false }) {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const active = pathname === '/network/me' || params.get('view') === 'profile' || params.has('profile') || pathname.startsWith('/network/account/') ? '/network/me' : ['/network/discover', '/network/search'].includes(pathname) ? '/network/discover' : ['/network/connections', '/network/notifications'].includes(pathname) ? pathname : '/network';
  return <nav className={bottom ? 'sd-bottom-nav' : undefined} aria-label={bottom ? 'Mobile social navigation' : 'Main social navigation'}>{entries.map(([Icon, label, path]) => <button key={path} type="button" className={active === path ? 'sd-nav-active' : undefined} aria-current={active === path ? 'page' : undefined} onClick={() => navigate(path)}><Icon size={20}/><span>{label}</span></button>)}</nav>;
}