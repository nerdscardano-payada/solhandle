import { Outlet, Link } from 'react-router-dom';
import { SunMoon } from 'lucide-react';
import { Image } from '@/components/ui/image';
import WalletButton from '@/components/solhandle/WalletButton';
import NetworkNavigation from '@/components/solhandle/network/NetworkNavigation';
import NetworkWalletCard from '@/components/solhandle/network/NetworkWalletCard';
import NetworkActivitySidebar from '@/components/solhandle/network/NetworkActivitySidebar';
import NetworkDesktopTopbar from '@/components/solhandle/network/NetworkDesktopTopbar';
import { useNetworkTheme } from '@/components/solhandle/network/NetworkThemeProvider';
const mark = 'https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/c9341a9b4_logo.png';
export default function NetworkShell() {
  const { theme } = useNetworkTheme();
  return <div data-social-theme={theme} className="network-surface min-h-screen bg-hero-canvas text-identity-text"><header className="network-mobile-header flex items-center justify-between border-b border-identity-border"><Link to="/network" className="social-brand"><Image src={mark} alt="" fittingType="fit" className="social-brand-image"/><span>SolHandle<small>Social</small></span></Link><div className="flex items-center gap-2"><Link to="/network/me#appearance" aria-label="Weergave instellen" className="social-action social-action-secondary"><SunMoon className="h-4 w-4"/></Link><WalletButton/></div></header><div className="network-grid mx-auto"><aside className="network-sidebar"><div className="network-desktop-brand"><Link to="/network" className="social-brand"><Image src={mark} alt="" fittingType="fit" className="social-brand-image"/><span>SolHandle<small>Social</small></span></Link></div><NetworkNavigation/><NetworkWalletCard/></aside><NetworkDesktopTopbar/><main id="social-content" className="network-main min-w-0 pb-6"><Outlet/></main><NetworkActivitySidebar enabled/></div></div>;
}