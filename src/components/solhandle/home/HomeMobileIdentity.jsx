import { ArrowRight, BadgeCheck, Fingerprint } from 'lucide-react';
import { Link } from 'react-router-dom';
import useProfileIdentity from '@/components/solhandle/profile/useProfileIdentity';

export default function HomeMobileIdentity() {
  const { address, identity, loading, error, refresh, refreshing } = useProfileIdentity();
  if (!address) return null;
  return <section className="home-mobile-identity" aria-label="Your connected identity">
    <div className="home-mobile-identity-heading"><Fingerprint size={22}/><h2>Your identity</h2></div>
    {loading ? <p role="status">Checking your wallet identity…</p> : error ? <><p role="alert">Your identity could not be verified.</p><button type="button" className="sd-text-button" disabled={refreshing} onClick={() => refresh()}>{refreshing ? 'Checking…' : 'Retry verification'}</button></> : identity?.primaryHandle ? <><strong className="home-mobile-handle" data-no-translate>@{identity.primaryHandle.replace(/^@/, '')}<BadgeCheck size={20} aria-label="Verified on-chain"/></strong><p>Primary Handle verified on-chain.</p><Link to="/profile" className="sd-text-button">View my identity <ArrowRight size={17}/></Link></> : <><p>Your wallet is connected. Choose an owned handle as your Primary Handle to complete your identity.</p><Link to="/my-handles" className="sd-text-button">Manage my handles <ArrowRight size={17}/></Link></>}
  </section>;
}