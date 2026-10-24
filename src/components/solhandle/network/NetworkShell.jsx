import { Outlet } from 'react-router-dom';
import NetworkSidebarShortcuts from '@/components/solhandle/network/NetworkSidebarShortcuts';
import NetworkNavigation from '@/components/solhandle/network/NetworkNavigation';
import NetworkWalletCard from '@/components/solhandle/network/NetworkWalletCard';
import NetworkActivitySidebar from '@/components/solhandle/network/NetworkActivitySidebar';
import NetworkDesktopTopbar from '@/components/solhandle/network/NetworkDesktopTopbar';
import { useNetworkTheme } from '@/components/solhandle/network/NetworkThemeProvider';

export default function NetworkShell() {
  const { theme } = useNetworkTheme();
  return <div data-social-theme={theme} className="network-surface network-migrated-shell min-h-screen bg-hero-canvas text-identity-text"><NetworkDesktopTopbar/><div className="network-grid mx-auto"><aside className="network-sidebar"><p className="network-ecosystem-label">YOUR ECOSYSTEM</p><NetworkNavigation/><NetworkSidebarShortcuts/><NetworkWalletCard/></aside><main id="social-content" className="network-main min-w-0 pb-6"><Outlet/></main><NetworkActivitySidebar enabled/></div></div>;
}