import { Link } from 'react-router-dom';
import { Bell, SunMoon } from 'lucide-react';
import NetworkSearch from '@/components/solhandle/network/NetworkSearch';
import WalletButton from '@/components/solhandle/WalletButton';
export default function NetworkDesktopTopbar() {
  return <div className="network-desktop-topbar"><div className="network-topbar-search"><NetworkSearch placeholder="Zoek mensen, projecten of berichten…"/></div><Link to="/network/notifications" aria-label="Meldingen" className="social-action social-action-secondary"><Bell className="h-4 w-4"/></Link><Link to="/network/me#appearance" aria-label="Weergave instellen" className="social-action social-action-secondary"><SunMoon className="h-4 w-4"/></Link><WalletButton/></div>;
}