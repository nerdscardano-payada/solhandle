import { Link, useLocation } from 'react-router-dom';
import { House, Compass, Users, MessageCircle, UserRound } from 'lucide-react';
const entries = [[House, 'Home', '/network'], [Compass, 'Ontdekken', '/network/discover'], [Users, 'Netwerk', '/network/connections'], [MessageCircle, 'Berichten', null], [UserRound, 'Profiel', '/network/me']];
export default function NetworkNavigation() {
  const { pathname, search } = useLocation();
  const params = new URLSearchParams(search);
  const selected = pathname === '/network/me' || (pathname === '/network' && params.get('view') === 'profile') ? '/network/me' : ['/network/search', '/network/discover'].includes(pathname) ? '/network/discover' : pathname === '/network/connections' ? pathname : '/network';
  const items = entries.map(([Icon, name, path]) => path ? <Link key={name} to={path} aria-label={name} aria-current={selected === path ? 'page' : undefined} className={`network-nav-item ${selected === path ? 'network-nav-active' : ''}`}><Icon className="h-5 w-5 shrink-0"/><span>{name}</span></Link> : <button type="button" key={name} disabled aria-label="Berichten, nog niet beschikbaar" title="Privé- en groepsgesprekken volgen na goedkeuring van het ontwerp." className="network-nav-item"><Icon className="h-5 w-5 shrink-0"/><span>{name}</span><small>Later</small></button>);
  return <><nav aria-label="Social hoofdnavigatie" className="social-primary-nav">{items}</nav><nav aria-label="Social mobiele navigatie" className="social-bottom-nav">{items}</nav></>;
}