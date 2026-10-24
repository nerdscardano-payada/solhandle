import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import WalletButton from '@/components/solhandle/WalletButton';

export default function PlatformLandingHeader() {
  return <header className="sd-topbar platform-landing-header">
    <Link to="/" className="sd-brand" aria-label="SolHandle homepage"><Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/c9341a9b4_logo.png" alt="" fittingType="fit" className="sd-logo"/><span>SolHandle<span className="sd-brand-period">.</span></span></Link>
    <nav className="sd-public-nav" aria-label="Public navigation"><Link to="/" aria-current="page">Home</Link><a href="#claim-handle">Claim Handle</a><Link to="/network">Explore Network</Link><Link to="/developers">Developers</Link></nav>
    <div className="sd-topbar-actions"><WalletButton/></div>
  </header>;
}