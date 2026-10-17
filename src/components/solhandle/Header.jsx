import '@/components/solhandle/header-desktop.css';
import { useIsMobile } from '@/hooks/use-mobile';
import { useWallet } from "@solana/wallet-adapter-react";
import { Search } from "lucide-react";
import HomeDesktopNavigation from '@/components/solhandle/home/HomeDesktopNavigation';
import Brand from "@/components/solhandle/Brand";
import MobileLanguageSelector from '@/components/i18n/MobileLanguageSelector';
import { Link } from 'react-router-dom';
import WalletButton from "@/components/solhandle/WalletButton";
import MarketplaceNotificationBell from "@/components/solhandle/MarketplaceNotificationBell";
import AdminTradeBell from "@/components/solhandle/AdminTradeBell";
import useMarketplaceNotifications from "@/hooks/useMarketplaceNotifications";


export default function Header({ onConnected, funnel = false }) {
  const isMobile = useIsMobile();
  const { publicKey } = useWallet();
  const wallet = publicKey?.toBase58() || "";
  const notifications = useMarketplaceNotifications(wallet);

  return <><header className="solhandle-platform-header relative mx-auto flex max-w-7xl items-center justify-between border-b border-white/10 px-5 py-4 lg:px-9">
    <Brand prominent />
    <HomeDesktopNavigation/>
    <div className="flex items-center gap-3"><Link to="/search" aria-label="Search a handle" className="hidden text-names-accent lg:block"><Search className="h-5 w-5"/></Link>{!funnel && !isMobile && <><MarketplaceNotificationBell wallet={wallet} bids={notifications.bids} sales={notifications.sales} onRefresh={notifications.refresh}/><AdminTradeBell/></>}<MobileLanguageSelector/><WalletButton onConnected={onConnected} /></div>
  </header></>;
}