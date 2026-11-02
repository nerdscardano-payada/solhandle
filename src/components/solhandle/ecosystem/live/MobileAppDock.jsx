import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, ContactRound, Send, UserRound } from 'lucide-react';

const items = [
  { Icon: Home, label: 'Home', to: '/', matches: path => path === '/' || path === '/ecosystem' },
  { Icon: Compass, label: 'Discover', to: '/discover', matches: path => path.startsWith('/discover') || path === '/profiles' || path === '/names' },
  { Icon: ContactRound, label: 'Contacts', to: '/contacts', matches: path => path === '/contacts' },
  { Icon: Send, label: 'Pay', to: '/pay', matches: path => path === '/pay' || path === '/receive' },
  { Icon: UserRound, label: 'Identity', to: '/profile', matches: path => path === '/profile' || path.startsWith('/profile/') || path === '/my-handles' || path === '/onboarding' }
];

export default function MobileAppDock() {
  const { pathname } = useLocation();
  return <nav className="el-app-dock" aria-label="Main mobile navigation">
    {items.map(({ Icon, label, to, matches }) => <Link key={to} to={to} aria-current={matches(pathname) ? 'page' : undefined}><Icon size={21} aria-hidden="true"/><span>{label}</span></Link>)}
  </nav>;
}