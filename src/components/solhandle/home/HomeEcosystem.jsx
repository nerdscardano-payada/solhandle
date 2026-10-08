import { Link } from 'react-router-dom';
import { Send, Layers, Coins } from 'lucide-react';
import LiveIntegrations from '@/components/solhandle/LiveIntegrations';
import MainnetContracts from '@/components/solhandle/MainnetContracts';

export default function HomeEcosystem() {
  return <div className="pb-10">
    <section className="home-content-section"><div className="home-two-grid"><div className="home-name-tile"><Layers className="h-8 w-8 text-names-secondary"/><h2 className="mt-5 text-2xl font-bold">Built to work across Solana</h2><p className="mt-3 text-sm leading-relaxed text-foreground/75">SolHandle gives wallets, dApps and payment platforms a simple way to resolve @ names to Solana addresses.</p><p className="mt-3 text-xs text-foreground/60">More integrations coming.</p><Link to="/integrations" className="mt-5 inline-flex text-sm text-names-accent">View Integrations →</Link></div><div className="home-name-tile"><Send className="h-8 w-8 text-names-accent"/><h2 className="mt-5 text-2xl font-bold">Send SOL to an @ name</h2><p className="home-gradient-text mt-4 text-3xl font-bold">@hawk → wallet</p><p className="mt-3 text-sm leading-relaxed text-foreground/75">SolHandle Pay already lets users send SOL using a human-readable @ name instead of copying a long wallet address.</p><Link to="/pay" className="home-primary-button mt-5 w-fit">Try SolHandle Pay →</Link></div></div><LiveIntegrations/></section>
    <section className="home-content-section"><div className="home-info-card"><Coins className="h-9 w-9 shrink-0 text-names-secondary"/><div><h2 className="text-xl font-bold">Mint with $HANDLE</h2><p className="mt-2 text-sm text-foreground/70">Pay for your SolHandle using $HANDLE and part of the payment is burned.</p><Link to="/upcoming/token-launch" className="mt-3 inline-flex text-sm text-names-accent">Learn about $HANDLE →</Link></div></div><MainnetContracts compact/></section>
  </div>;
}