import { Link } from 'react-router-dom';
import { Bell, PenLine } from 'lucide-react';
import NetworkSearch from '@/components/solhandle/network/NetworkSearch';
import NetworkGate from '@/components/solhandle/network/NetworkGate';
import WalletButton from '@/components/solhandle/WalletButton';
export default function NetworkDesktopTopbar() {
  return <div className="network-desktop-topbar"><div className="network-topbar-search"><NetworkSearch placeholder="Search public profiles, bios and posts…"/></div><span className="network-preview-label">Public preview</span><Link to="/network/notifications" aria-label="Open Network notifications" className="network-topbar-icon"><Bell className="h-4 w-4"/></Link><WalletButton/><NetworkGate action="Create a Network post"><button className="flex items-center gap-2 rounded-lg bg-names-accent px-4 py-2.5 text-xs font-semibold"><PenLine className="h-4 w-4"/>Create</button></NetworkGate></div>;
}