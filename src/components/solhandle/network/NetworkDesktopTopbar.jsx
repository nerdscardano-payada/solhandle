import { Link } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import NetworkBrand from '@/components/solhandle/network/NetworkBrand';
import NetworkSearch from '@/components/solhandle/network/NetworkSearch';
import WalletButton from '@/components/solhandle/WalletButton';
export default function NetworkDesktopTopbar() {
  return <header className="network-shared-header"><NetworkBrand/><div className="network-topbar-search"><NetworkSearch placeholder="Search people or posts…"/></div><div className="network-shared-actions"><Link to="/network/search" aria-label="Search Network" className="network-header-search-link social-action social-action-secondary"><Search className="h-4 w-4"/></Link><Link to="/network/notifications" aria-label="Notifications" className="network-header-notifications social-action social-action-secondary"><Bell className="h-4 w-4"/></Link><WalletButton/></div></header>;
}