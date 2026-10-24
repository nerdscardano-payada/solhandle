import { ArrowRight, Fingerprint } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PlatformLandingSteps() {
  return <div className="sd-public-under">
    <div className="sd-section-heading"><div><span className="sd-eyebrow">SOCIAL · IDENTITY · PAY</span><h2>It all starts with your @handle.</h2></div><p>No complicated addresses.<br/>Just you, connected.</p></div>
    <div className="sd-explain-row">{[['01', 'Choose your name', 'Find a handle that suits you.'], ['02', 'Make it yours', 'Claim with your own wallet.'], ['03', 'Use it everywhere', 'For your network, identity and payments.']].map(([number, title, copy]) => <div key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></div>)}</div>
    <footer className="sd-public-footer"><Fingerprint size={18}/><strong>SolHandle</strong><span>Your identity. Your possibilities.</span><Link className="sd-text-button" to="/developers">For developers <ArrowRight size={14}/></Link><Link to="/legal">Legal</Link><Link to="/privacy">Privacy</Link></footer>
  </div>;
}