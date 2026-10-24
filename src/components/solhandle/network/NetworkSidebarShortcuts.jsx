import { Link } from 'react-router-dom';
import { ArrowUpRight, Coins, Fingerprint, Send } from 'lucide-react';
import NetworkPayPanel from '@/components/solhandle/network/NetworkPayPanel';

export default function NetworkSidebarShortcuts() {
  return <nav className="network-ecosystem-shortcuts" aria-label="SolHandle ecosystem">
    <NetworkPayPanel><button type="button"><Send className="h-4 w-4"/><span>SolHandle Pay</span><ArrowUpRight className="h-3.5 w-3.5"/></button></NetworkPayPanel>
    <Link to="/"><Fingerprint className="h-4 w-4"/><span>Claim a handle</span><ArrowUpRight className="h-3.5 w-3.5"/></Link>
    <Link to="/growth"><Coins className="h-4 w-4"/><span>Discover $HANDLE</span><ArrowUpRight className="h-3.5 w-3.5"/></Link>
  </nav>;
}