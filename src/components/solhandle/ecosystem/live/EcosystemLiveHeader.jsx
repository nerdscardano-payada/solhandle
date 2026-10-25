import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import WalletButton from '@/components/solhandle/WalletButton';
import { ecosystemAssets } from '@/components/solhandle/ecosystem/live/ecosystemRoutes';
export default function EcosystemLiveHeader() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const isHome = useLocation().pathname === '/';
  const submit = event => { event.preventDefault(); const q = search.trim().replace(/^@/, ''); if (q) navigate(`/search?q=${encodeURIComponent(q)}`); };
  return <header className="ep-header">
    <Link to="/" className="ep-brand" aria-label="SolHandle public homepage"><Image src={ecosystemAssets.logo} alt="" fittingType="fit" className="ep-logo" loading="eager"/><span>SolHandle<small>ONE IDENTITY. ONE ECOSYSTEM.</small></span></Link>
    {isHome ? <nav className="el-home-navigation" aria-label="Homepage navigation"><Link to="/ecosystem">Ecosystem</Link><Link to="/discover">Discover</Link><Link to="/developers">Developers</Link></nav> : <form onSubmit={submit} className="ep-global-search" role="search"><Search size={18}/><input value={search} onChange={event => setSearch(event.target.value)} aria-label="Search SolHandle names" placeholder="Search @handles on Solana..." maxLength={20} required/><button type="submit" aria-label="Search names"><ArrowRight size={17}/></button></form>}
    <div className="ep-header-actions"><Link to="/search" className="ep-icon ep-mobile-search" aria-label="Search handles"><Search size={20}/></Link><WalletButton className="ep-button el-wallet-button"/></div>
  </header>;
}