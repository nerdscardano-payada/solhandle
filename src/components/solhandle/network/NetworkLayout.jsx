import { Outlet, Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Brand from '@/components/solhandle/Brand';
import NetworkSearch from '@/components/solhandle/network/NetworkSearch';
import NetworkGate from '@/components/solhandle/network/NetworkGate';
import WalletButton from '@/components/solhandle/WalletButton';
import NetworkNavigation from '@/components/solhandle/network/NetworkNavigation';
import NetworkWalletCard from '@/components/solhandle/network/NetworkWalletCard';
import NetworkActivitySidebar from '@/components/solhandle/network/NetworkActivitySidebar';
import NetworkDesktopTopbar from '@/components/solhandle/network/NetworkDesktopTopbar';
import '@/components/solhandle/network/network.css';
import '@/components/solhandle/network/network-desktop.css';
export default function NetworkLayout() {
  const { user } = useAuth();
  const mobile = useIsMobile();
  return <div className="network-surface min-h-screen bg-hero-canvas text-identity-text">
    <header className="network-mobile-header mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 border-b border-identity-border px-5 py-5"><Brand/><Link to="/network" className="text-sm font-semibold tracking-wide text-names-accent">NETWORK <span className="ml-2 rounded-full border border-names-accent/30 px-2 py-1 text-[10px] tracking-widest">PUBLIC PREVIEW</span></Link><div className="flex flex-wrap items-center gap-3"><WalletButton/><NetworkGate/></div></header>
    <div className="network-grid mx-auto max-w-7xl">
      <aside className="network-sidebar px-5 py-6"><div className="network-desktop-brand"><Brand/><p>Social · Your @ on Solana</p></div><NetworkNavigation/>{user?.role === 'admin' && <Link to="/network/lab" className="network-sidebar-admin mt-5 flex items-center gap-2 rounded-xl border border-names-warning/30 p-3 text-sm font-semibold text-names-warning">Social development lab<ArrowUpRight className="h-4 w-4"/></Link>}<div className="network-sidebar-search mt-7 hidden md:block"><NetworkSearch/><p className="mt-6 text-xs leading-relaxed text-identity-muted">Your account keeps your history. Your wallet proves control. Your handle is your public identity.</p></div>{user?.role === 'admin' && !mobile && <Link className="network-sidebar-admin mt-5 inline-flex items-center gap-2 text-sm text-names-secondary" to="/admin/network-preview">Operator publishing<ArrowUpRight className="h-4 w-4"/></Link>}{!mobile && <NetworkWalletCard/>}</aside>
      {!mobile && <NetworkDesktopTopbar/>}
      <main className="network-main min-w-0 pb-14"><Outlet/></main>
      {!mobile && <NetworkActivitySidebar enabled={!mobile}/>}
    </div>
  </div>;
}