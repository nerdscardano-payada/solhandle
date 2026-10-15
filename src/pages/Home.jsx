import { useEffect, useState } from 'react';
import Header from '@/components/solhandle/Header';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileMintHome from '@/components/solhandle/home/MobileMintHome';
import PublicHandleMintRecovery from '@/components/solhandle/PublicHandleMintRecovery';
import HomeMintHero from '@/components/solhandle/home/HomeMintHero';
import HomeHeroDemos from '@/components/solhandle/home/HomeHeroDemos';
import HomeBackdrop from '@/components/solhandle/home/HomeBackdrop';

import HomeDesktopContent from '@/components/solhandle/home/HomeDesktopContent';
import { captureReferralAttribution } from '@/lib/referralAttribution';
import { base44 } from '@/api/base44Client';
import '@/components/solhandle/home/home-funnel.css';

export default function Home() {
  const isMobile = useIsMobile();
  const [wallet, setWallet] = useState(() => localStorage.getItem("solhandle_wallet") || "");

  useEffect(() => { captureReferralAttribution().catch(() => null); base44.analytics.track({ eventName: 'homepage_view', properties: { device: window.innerWidth < 1280 ? 'mobile' : 'desktop', source: new URLSearchParams(window.location.search).get('utm_source') || 'direct' } }); }, []);
  if (isMobile) return <main className="home-funnel dark min-h-screen bg-hero-canvas"><Header onConnected={setWallet} funnel/><PublicHandleMintRecovery/><MobileMintHome wallet={wallet}/></main>;
  return <main className="home-funnel dark"><HomeBackdrop/><Header onConnected={setWallet} funnel/><PublicHandleMintRecovery/><HomeMintHero wallet={wallet}/><HomeHeroDemos/><div className="home-content"><HomeDesktopContent/></div></main>;
}