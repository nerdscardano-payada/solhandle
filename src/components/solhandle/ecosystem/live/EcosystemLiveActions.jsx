import { Link } from 'react-router-dom';
import { UsersRound, Compass, Send, ContactRound, ArrowUpRight } from 'lucide-react';
const actions = [[ContactRound, 'My Contacts', 'Manage your private address book', '/contacts'], [Send, 'Send Payment', 'Review and pay using an @handle', '/pay'], [UsersRound, 'Discover People', 'Explore public profiles', '/discover?tab=people'], [Compass, 'Explore Projects', 'Discover Solana builders', '/discover?tab=projects']];
export default function EcosystemLiveActions() {
  return <nav className="dashboard-quick-actions" aria-label="Ecosystem quick actions">{actions.map(([Icon, label, description, to]) => <Link className="ep-card" key={to} to={to}><Icon size={22}/><strong>{label}</strong><span>{description}</span><ArrowUpRight size={16}/></Link>)}</nav>;
}