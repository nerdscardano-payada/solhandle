import { Outlet } from 'react-router-dom';
import NetworkSidebarShortcuts from '@/components/solhandle/network/NetworkSidebarShortcuts';
import NetworkNavigation from '@/components/solhandle/network/NetworkNavigation';
import { Image } from '@/components/ui/image';
import { useLocation } from 'react-router-dom';
import NetworkActivitySidebar from '@/components/solhandle/network/NetworkActivitySidebar';
import NetworkDesktopTopbar from '@/components/solhandle/network/NetworkDesktopTopbar';
import { useNetworkTheme } from '@/components/solhandle/network/NetworkThemeProvider';

export default function NetworkShell() {
  const { theme } = useNetworkTheme();
  const { pathname } = useLocation();
  const profileView = pathname === '/network/me' || pathname.startsWith('/network/account/');
  return <div data-social-theme={theme} className="network-surface network-migrated-shell min-h-screen bg-hero-canvas text-identity-text">{!profileView && <><Image className="network-live-city" src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/2d63a5eb6_image.png" alt="" aria-hidden="true" focalPointX={0.75}/><div className="network-live-shade"/></>}<NetworkDesktopTopbar/><div className="network-grid mx-auto"><aside className="network-sidebar"><p className="network-ecosystem-label">YOUR ECOSYSTEM</p><NetworkNavigation/><NetworkSidebarShortcuts/></aside><main id="social-content" className="network-main min-w-0 pb-6"><Outlet/></main><NetworkActivitySidebar enabled/></div></div>;
}