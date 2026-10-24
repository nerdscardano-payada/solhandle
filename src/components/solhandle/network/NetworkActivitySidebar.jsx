import { Link } from 'react-router-dom';
import { ContactRound, Compass } from 'lucide-react';
import NetworkPayPanel from '@/components/solhandle/network/NetworkPayPanel';
import NetworkWalletCard from '@/components/solhandle/network/NetworkWalletCard';
export default function NetworkActivitySidebar() {
  return <aside className="network-context network-activity-sidebar" aria-label="Identity and Pay"><NetworkWalletCard/><section className="network-panel"><h2 className="mb-2 text-base font-semibold">SolHandle Pay</h2><NetworkPayPanel/></section><section className="network-panel"><h2 className="mb-3 text-base font-semibold">Mijn netwerk</h2><Link to="/network/connections" className="network-utility-link text-sm"><ContactRound className="h-4 w-4"/>Contacten</Link><Link to="/network/discover" className="network-utility-link text-sm"><Compass className="h-4 w-4"/>Mensen & projecten</Link></section></aside>;
}