import { Link } from 'react-router-dom';
import { Fingerprint, ContactRound, Send, Code2, ArrowUpRight } from 'lucide-react';
import '@/components/solhandle/ecosystem/live/home-activation.css';

const useCases = [
  { Icon: Fingerprint, title: 'Identity', text: 'Claim an @handle and use it as your recognizable Solana identity.', to: '/search', action: 'Claim your @handle' },
  { Icon: ContactRound, title: 'Contacts', text: 'Save people without managing long wallet addresses. Your saved wallet stays under your control.', to: '/contacts', action: 'Explore Contacts' },
  { Icon: Send, title: 'Payments', text: 'Send SOL and supported tokens using a verified @handle, with a recipient review before approval.', to: '/pay', action: 'Explore SolHandle Pay' },
  { Icon: Code2, title: 'Integrations', text: 'Bring human-readable identities into Solana applications using existing developer tools.', to: '/developers', action: 'Build with SolHandle' }
];
export default function HomeEcosystemPillars() {
  return <section className="el-home-pillars" aria-labelledby="home-pillars-title"><div className="ep-public-intro"><span className="ep-eyebrow">THE SOLHANDLE ECOSYSTEM</span><h2 id="home-pillars-title">One @handle.<br/>More ways to connect.</h2><p>Your unique human-readable @handle, owned as an NFT on Solana. Use your identity without giving up control of your wallet.</p></div><div className="home-use-case-grid">{useCases.map(({ Icon, title, text, to, action }) => <Link className="ep-card" to={to} key={title}><Icon size={24}/><h3>{title}</h3><p>{text}</p><span className="ep-link">{action}<ArrowUpRight size={16}/></span></Link>)}</div></section>;
}