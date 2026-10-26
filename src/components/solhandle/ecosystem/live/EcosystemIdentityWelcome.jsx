import { Link } from 'react-router-dom';
import { Fingerprint, Wallet, Search, Compass } from 'lucide-react';

export default function EcosystemIdentityWelcome() {
  return <section className="ep-card ep-identity">
    <div className="ep-card-heading"><h2><Fingerprint size={20}/>Your Identity</h2></div>
    <h3>Your wallet. Your identity.</h3>
    <p>Start with your wallet, find your @handle and make yourself at home on Solana.</p>
    <ol className="mt-6 grid gap-6 md:grid-cols-3">
      <li className="min-w-0 space-y-3">
        <h4>1. Connect your wallet</h4>
        <p>Your keys stay with you.</p>
        <button type="button" className="ep-button ep-primary" onClick={() => window.dispatchEvent(new CustomEvent('solhandle:connect-wallet'))}><Wallet size={16}/>Connect Wallet</button>
      </li>
      <li className="min-w-0 space-y-3">
        <h4>2. Find your @handle</h4>
        <p>Choose a name that is yours.</p>
        <Link className="ep-button" to="/search"><Search size={16}/>Find Your Handle</Link>
      </li>
      <li className="min-w-0 space-y-3">
        <h4>3. Explore the ecosystem</h4>
        <p>Discover projects across Solana.</p>
        <Link className="ep-button" to="/discover"><Compass size={16}/>Explore Solana</Link>
      </li>
    </ol>
  </section>;
}