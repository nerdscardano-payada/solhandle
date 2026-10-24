import { Fingerprint, Users, Wallet, ArrowUpRight, ShieldCheck, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import useProfileIdentity from '@/components/solhandle/profile/useProfileIdentity';

export default function PlatformOverview() {
  const { address, identity, loading, error } = useProfileIdentity();
  const label = loading ? 'Checking your identity…' : error ? 'Identity not verified' : identity?.primaryHandle ? `@${identity.primaryHandle.replace(/^@/, '')}` : address ? 'Choose your @handle' : 'Your @handle';
  return <div className="sd-visual-wrap"><div className="sd-visual-dashboard">
    <header className="sd-visual-dashboard-header"><span><Fingerprint size={21}/><strong>SolHandle</strong></span><small>PEOPLE · IDENTITY · POSSIBILITIES</small></header>
    <div className="sd-visual-columns">
      <article className="sd-visual-panel sd-visual-social"><Link to="/network" className="sd-visual-panel-title"><span><Users size={18}/></span><strong>Social</strong><ArrowUpRight size={15}/></Link>
        <div className="platform-overview-body"><Image className="platform-overview-scenery" src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/2d63a5eb6_image.png" alt="Solana city skyline" focalPointX={0.87}/><h2>Your people.<br/>Your possibilities.</h2><p>Discover public posts, people and projects. Start with the real network.</p><Link to="/network/discover" className="sd-text-button">Explore Network <ArrowUpRight size={14}/></Link></div>
      </article>
      <article className="sd-visual-panel sd-visual-identity"><Link to="/network/me" className="sd-visual-panel-title"><span><Fingerprint size={18}/></span><strong>Identity</strong><ArrowUpRight size={15}/></Link>
        <div className="platform-overview-body"><span className="platform-overview-identity" aria-hidden="true"><UserRound size={44}/></span><h2 data-no-translate>{label}</h2><p>{identity?.primaryHandle && !error ? 'Your Primary Handle, verified on-chain in your connected wallet.' : 'A unique name you own. Connect your existing wallet to view your identity.'}</p><Link to="/network/me" className="sd-button sd-gradient">My identity <ArrowUpRight size={14}/></Link><small>Wallet connection is not a Social login.</small></div>
      </article>
      <article className="sd-visual-panel sd-visual-pay"><Link to="/pay" className="sd-visual-panel-title"><span><Wallet size={18}/></span><strong>Pay</strong><ArrowUpRight size={15}/></Link>
        <div className="platform-overview-body"><h2>Pay a name.<br/>Not an address.</h2><p>Choose the recipient and amount. Review the destination before you sign.</p><Link to="/pay" className="sd-button sd-gradient">Open Pay <ArrowUpRight size={14}/></Link><Link to="/contacts" className="sd-text-button">My Contacts <ArrowUpRight size={14}/></Link><small><ShieldCheck size={14}/> You confirm in your wallet.</small></div>
      </article>
    </div>
    <footer className="sd-visual-dashboard-footer"><span><i/> ONE ECOSYSTEM. ALL YOURS.</span><small>Social · Identity · Pay</small></footer>
  </div></div>;
}