import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { Menu, X } from "lucide-react";
import Brand from "@/components/solhandle/Brand";
import DiscoverMenu from "@/components/solhandle/DiscoverMenu";
import DevelopersMenu from "@/components/solhandle/DevelopersMenu";
import MoreMenu from "@/components/solhandle/MoreMenu";
import GrowthMenu from "@/components/solhandle/GrowthMenu";
import HeaderExternalLinks from "@/components/solhandle/HeaderExternalLinks";
import WalletButton from "@/components/solhandle/WalletButton";
import MarketplaceNotificationBell from "@/components/solhandle/MarketplaceNotificationBell";
import AdminTradeBell from "@/components/solhandle/AdminTradeBell";
import MobileNavigation from "@/components/solhandle/MobileNavigation";
import useMarketplaceNotifications from "@/hooks/useMarketplaceNotifications";
import useTokenLaunchSettings from "@/hooks/useTokenLaunchSettings";

const links = [["My Handles", "/my-handles"], ["Pay", "/pay"], ["Market", "/market"], ["Earn", "/earn"], ["$HANDLE", "/upcoming/token-launch"]];

export default function Header({ onConnected }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { publicKey } = useWallet();
  const wallet = publicKey?.toBase58() || "";
  const notifications = useMarketplaceNotifications(wallet);
  const { tokenMint } = useTokenLaunchSettings();
  const tokenIsLive = Boolean(tokenMint);
  const linkClass = ({ isActive }) => `border-b-2 pb-1 text-sm ${isActive ? "border-emerald-300 text-white" : "border-transparent text-slate-400 hover:text-white"}`;
  return <header className="relative mx-auto flex max-w-7xl items-center justify-between border-b border-white/10 px-5 py-4 lg:px-9">
    <Brand />
    <nav className="hidden items-center gap-6 lg:flex xl:gap-7"><DiscoverMenu />{links.map(([label, path]) => <NavLink key={path} to={path} className={({ isActive }) => path === "/upcoming/token-launch" && tokenIsLive ? "inline-flex animate-pulse items-center gap-1.5 border-b-2 border-emerald-300 pb-1 text-sm font-semibold text-emerald-300" : linkClass({ isActive })}>{label}{path === "/upcoming/token-launch" && tokenIsLive && <span className="rounded bg-emerald-400/15 px-1.5 py-0.5 text-[9px] tracking-wider text-emerald-200">LIVE</span>}</NavLink>)}<GrowthMenu /><DevelopersMenu /><MoreMenu /></nav>
    <div className="flex items-center gap-3"><HeaderExternalLinks/><MarketplaceNotificationBell wallet={wallet} bids={notifications.bids} sales={notifications.sales} onRefresh={notifications.refresh}/><AdminTradeBell/><WalletButton onConnected={onConnected} /><button type="button" onClick={() => setMenuOpen((open) => !open)} className="text-slate-300 lg:hidden" aria-label="Toggle navigation" aria-expanded={menuOpen}>{menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button></div>
    {menuOpen && <MobileNavigation onNavigate={() => setMenuOpen(false)} tokenIsLive={tokenIsLive} />}
  </header>;
}