import '@/components/solhandle/header-desktop.css';
import { useEcosystemFrame } from '@/components/solhandle/ecosystem/live/EcosystemFrameContext';
import { Search } from "lucide-react";
import HomeDesktopNavigation from '@/components/solhandle/home/HomeDesktopNavigation';
import Brand from "@/components/solhandle/Brand";
import MobileLanguageSelector from '@/components/i18n/MobileLanguageSelector';
import { Link } from 'react-router-dom';
import WalletButton from "@/components/solhandle/WalletButton";


export default function Header({ onConnected, funnel = false }) {
  const ecosystemFrame = useEcosystemFrame();
  if (ecosystemFrame) return null;

  return <><header className="solhandle-platform-header relative mx-auto flex max-w-7xl items-center justify-between border-b border-white/10 px-5 py-4 lg:px-9">
    <Brand prominent />
    <HomeDesktopNavigation/>
    <div className="flex items-center gap-3"><Link to="/search" aria-label="Search a handle" className="hidden text-names-accent lg:block"><Search className="h-5 w-5"/></Link><MobileLanguageSelector/><WalletButton onConnected={onConnected} /></div>
  </header></>;
}