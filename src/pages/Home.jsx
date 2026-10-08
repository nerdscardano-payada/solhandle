import { useEffect, useState } from 'react';
import Header from '@/components/solhandle/Header';
import PublicHandleMintRecovery from '@/components/solhandle/PublicHandleMintRecovery';
import HomeMintHero from '@/components/solhandle/home/HomeMintHero';
import HomeBackdrop from '@/components/solhandle/home/HomeBackdrop';

import HomeDesktopContent from '@/components/solhandle/home/HomeDesktopContent';
import { captureReferralAttribution } from '@/lib/referralAttribution';
import { base44 } from '@/api/base44Client';
import '@/components/solhandle/home/home-funnel.css';

export default function Home() {
  const [wallet, setWallet] = useState(() => localStorage.getItem("solhandle_wallet") || "");

  useEffect(() => { captureReferralAttribution().catch(() => null); base44.analytics.track({ eventName: 'homepage_view', properties: { device: window.innerWidth < 1280 ? 'mobile' : 'desktop', source: new URLSearchParams(window.location.search).get('utm_source') || 'direct' } }); }, []);
  return <main className="home-funnel dark"><HomeBackdrop/><Header onConnected={setWallet} funnel/><PublicHandleMintRecovery/><HomeMintHero wallet={wallet}/><div className="home-content"><HomeDesktopContent/></div></main>;
}