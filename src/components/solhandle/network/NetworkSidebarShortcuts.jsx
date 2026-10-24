import { Link } from 'react-router-dom';
import { ArrowUpRight, Coins, Fingerprint, Send } from 'lucide-react';
import NetworkPayPanel from '@/components/solhandle/network/NetworkPayPanel';

export default function NetworkSidebarShortcuts() {
  return <div className="live-ecosystem-shortcuts" role="navigation" aria-label="SolHandle ecosystem">
    <NetworkPayPanel><button type="button" className="sd-sidebar-shortcut"><Send className="h-4 w-4"/><span>SolHandle Pay</span><ArrowUpRight className="h-3.5 w-3.5"/></button></NetworkPayPanel>
    <Link to="/" className="sd-sidebar-shortcut"><Fingerprint className="h-4 w-4"/><span>Claim a handle</span><ArrowUpRight className="h-3.5 w-3.5"/></Link>
    <Link to="/growth" className="sd-sidebar-shortcut"><Coins className="h-4 w-4"/><span>Discover $HANDLE</span><ArrowUpRight className="h-3.5 w-3.5"/></Link>
  </div>;
}