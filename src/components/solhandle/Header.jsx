import { useIsMobile } from '@/hooks/use-mobile';
import { useWallet } from "@solana/wallet-adapter-react";
import { Search } from "lucide-react";
import HomeDesktopNavigation from '@/components/solhandle/home/HomeDesktopNavigation';
import Brand from "@/components/solhandle/Brand";
import MobileLanguageSelector from '@/components/i18n/MobileLanguageSelector';
import { Link, useLocation } from 'react-router-dom';
import PublicStatsBar from '@/components/solhandle/PublicStatsBar';
import WalletButton from "@/components/solhandle/WalletButton";
import MarketplaceNotificationBell from "@/components/solhandle/MarketplaceNotificationBell";
import AdminTradeBell from "@/components/solhandle/AdminTradeBell";
import useMarketplaceNotifications from "@/hooks/useMarketplaceNotifications";
import useTokenLaunchSettings from "@/hooks/useTokenLaunchSettings";

export default function Header({ onConnected, funnel = false }) {
  const isMobile = useIsMobile();
  const { publicKey } = useWallet();
  const wallet = publicKey?.toBase58() || "";
  const notifications = useMarketplaceNotifications(wallet);
  const { tokenMint, loading: settingsLoading } = useTokenLaunchSettings();
  const { pathname } = useLocation();
  const isPublic = !pathname.startsWith('/admin') && !pathname.startsWith('/widgets/') && !['/login', '/register', '/forgot-password', '/reset-password', '/mint', '/oauth-consent'].includes(pathname);
  return <><header className="solhandle-platform-header relative mx-auto flex max-w-7xl items-center justify-between border-b border-white/10 px-5 py-4 lg:px-9">
    <Brand prominent />
    <HomeDesktopNavigation funnel={funnel}/>
    <div className="flex items-center gap-3"><Link to="/search" aria-label="Search a handle" className="hidden text-names-accent lg:block"><Search className="h-5 w-5"/></Link>{!funnel && !isMobile && <><MarketplaceNotificationBell wallet={wallet} bids={notifications.bids} sales={notifications.sales} onRefresh={notifications.refresh}/><AdminTradeBell/></>}<MobileLanguageSelector/><WalletButton onConnected={onConnected} /></div>
  </header>{isPublic && !isMobile && <PublicStatsBar tokenMint={tokenMint} settingsLoading={settingsLoading}/>}</>;
}