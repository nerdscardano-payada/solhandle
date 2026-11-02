import { Link } from 'react-router-dom';
import { Fingerprint, UsersRound, ContactRound, Send, ArrowUpRight } from 'lucide-react';
import '@/components/solhandle/ecosystem/live/home-ecosystem-bar.css';

const useCases = [
  { Icon: Fingerprint, title: 'Identity', text: 'Your unique @handle, owned in your wallet.', to: '/search', action: 'Claim your @handle' },
  { Icon: UsersRound, title: 'Discover', text: 'Find people and projects across Solana.', to: '/discover', action: 'Explore Discover' },
  { Icon: ContactRound, title: 'Contacts', text: 'Keep your people in a private address book.', to: '/contacts', action: 'Explore Contacts' },
  { Icon: Send, title: 'Pay', text: 'Pay an @handle. Review and approve in your wallet.', to: '/pay', action: 'Explore SolHandle Pay' }
];
export default function HomeEcosystemPillars() {
  return <section className="home-ecosystem-bar" aria-labelledby="home-pillars-title"><h2 id="home-pillars-title">One @handle. More ways to connect.</h2><div className="home-ecosystem-bar-items">{useCases.map(({ Icon, title, text, to, action }) => <Link to={to} key={title}><Icon size={22} aria-hidden="true"/><div><h3>{title}</h3><p>{text}</p><span className="ep-link">{action}<ArrowUpRight size={14} aria-hidden="true"/></span></div></Link>)}</div></section>;
}