import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Menu, X, Search } from "lucide-react";
import HomeDesktopNavigation from '@/components/solhandle/home/HomeDesktopNavigation';
import Brand from "@/components/solhandle/Brand";
import HeaderExternalLinks from "@/components/solhandle/HeaderExternalLinks";
import WalletButton from "@/components/solhandle/WalletButton";
import MarketplaceNotificationBell from "@/components/solhandle/MarketplaceNotificationBell";
import AdminTradeBell from "@/components/solhandle/AdminTradeBell";
import MobileNavigation from "@/components/solhandle/MobileNavigation";
import useMarketplaceNotifications from "@/hooks/useMarketplaceNotifications";
import useTokenLaunchSettings from "@/hooks/useTokenLaunchSettings";

export default function Header({ onConnected, funnel = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { publicKey } = useWallet();
  const wallet = publicKey?.toBase58() || "";
  const notifications = useMarketplaceNotifications(wallet);
  const { tokenMint } = useTokenLaunchSettings();
  const tokenIsLive = Boolean(tokenMint);
  return <header className="solhandle-platform-header relative mx-auto flex max-w-7xl items-center justify-between border-b border-white/10 px-5 py-4 lg:px-9">
    <Brand prominent />
    <HomeDesktopNavigation/>
    <div className="flex items-center gap-3">{funnel ? <button aria-label="Search a handle" onClick={() => { document.getElementById('search-handles')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); document.getElementById('home-handle-input')?.focus(); }} className="hidden text-names-accent lg:block"><Search className="h-5 w-5"/></button> : <HeaderExternalLinks/>}{!funnel && <><MarketplaceNotificationBell wallet={wallet} bids={notifications.bids} sales={notifications.sales} onRefresh={notifications.refresh}/><AdminTradeBell/></>}<WalletButton onConnected={onConnected} /><button type="button" onClick={() => setMenuOpen((open) => !open)} className="text-slate-300 lg:hidden" aria-label="Toggle navigation" aria-expanded={menuOpen}>{menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button></div>
    {menuOpen && <MobileNavigation onNavigate={() => setMenuOpen(false)} tokenIsLive={tokenIsLive} />}
  </header>;
}