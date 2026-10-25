import { Link } from 'react-router-dom';
import { Home, Search, Users, Fingerprint } from 'lucide-react';
import MobileAppMore from '@/components/solhandle/MobileAppMore';

export default function HomeMobileNavigation() {
  const claim = () => {
    const input = document.getElementById('home-handle-input');
    document.getElementById('claim-handle')?.scrollIntoView({ block: 'start' });
    input?.focus({ preventScroll: true });
  };
  return <div className="mobile-app-navigation home-mobile-navigation dark md:hidden">
    <nav className="mobile-app-tabs" aria-label="Homepage navigation">
      <Link to="/" className="mobile-app-tab mobile-app-tab-active" aria-current="page" onClick={() => window.scrollTo({ top: 0 })}><Home size={21}/><span>Home</span></Link>
      <button type="button" className="mobile-app-tab" onClick={claim}><Search size={21}/><span>Claim</span></button>
      <Link to="/network" className="mobile-app-tab"><Users size={21}/><span>Network</span></Link>
      <Link to="/my-handles" className="mobile-app-tab"><Fingerprint size={21}/><span>My handles</span></Link>
      <MobileAppMore/>
    </nav>
  </div>;
}