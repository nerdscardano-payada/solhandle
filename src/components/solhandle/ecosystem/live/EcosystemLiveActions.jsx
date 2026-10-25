import { Link } from 'react-router-dom';
import { Plus, Send, Download, ContactRound, ArrowUpRight } from 'lucide-react';
const actions = [[Plus, 'Claim a Handle', '/search'], [Send, 'Send Payment', '/pay'], [Download, 'Receive Payment', '/receive'], [ContactRound, 'My Contacts', '/contacts']];
export default function EcosystemLiveActions() {
  return <section className="ep-card ep-quick"><h2>Quick Actions</h2><div>{actions.map(([Icon, label, to]) => <Link key={to} to={to}><Icon size={18}/>{label}<ArrowUpRight size={15}/></Link>)}</div></section>;
}