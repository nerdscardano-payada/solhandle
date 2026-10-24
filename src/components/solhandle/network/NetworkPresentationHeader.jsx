import { Link, useNavigate } from 'react-router-dom';
import { Search, Sun, Moon } from 'lucide-react';
import { Image } from '@/components/ui/image';
import NetworkSearch from '@/components/solhandle/network/NetworkSearch';
import WalletButton from '@/components/solhandle/WalletButton';
import { useNetworkTheme } from '@/components/solhandle/network/NetworkThemeProvider';

export default function NetworkPresentationHeader() {
  const { theme, setPreference } = useNetworkTheme();
  const navigate = useNavigate();
  return <header className="sd-topbar"><Link to="/" className="sd-brand" aria-label="SolHandle homepage"><Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/c9341a9b4_logo.png" alt="" fittingType="fit" className="sd-logo"/><span>SolHandle<span className="sd-brand-period">.</span></span></Link><NetworkSearch presentation="preview" placeholder="Search people, projects, @handles…"/><div className="sd-topbar-actions"><button className="sd-icon-button sd-header-search" aria-label="Search Network" onClick={() => navigate('/network/search')}><Search size={18}/></button><button className="sd-icon-button" aria-label="Switch theme" onClick={() => setPreference(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <Sun size={17}/> : <Moon size={17}/>}</button><WalletButton className="sd-wallet-button"/></div></header>;
}