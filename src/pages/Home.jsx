import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import usePullToRefresh from '@/hooks/usePullToRefresh';
import PullRefreshStatus from '@/components/solhandle/PullRefreshStatus';
import Header from '@/components/solhandle/Header';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileMintHome from '@/components/solhandle/home/MobileMintHome';
import PublicHandleMintRecovery from '@/components/solhandle/PublicHandleMintRecovery';
import HomeMintHero from '@/components/solhandle/home/HomeMintHero';
import HomeHeroDemos from '@/components/solhandle/home/HomeHeroDemos';
import HomePayStory from '@/components/solhandle/home/HomePayStory';
import HomeBackdrop from '@/components/solhandle/home/HomeBackdrop';

import HomeDesktopContent from '@/components/solhandle/home/HomeDesktopContent';
import { captureReferralAttribution } from '@/lib/referralAttribution';
import { base44 } from '@/api/base44Client';
import '@/components/solhandle/home/home-funnel.css';

export default function Home() {
  const isMobile = useIsMobile();
  const [wallet, setWallet] = useState(() => localStorage.getItem("solhandle_wallet") || "");
  const client = useQueryClient();
  const [refreshVersion, setRefreshVersion] = useState(0);
  const pull = usePullToRefresh(async () => {
    await client.invalidateQueries({ queryKey: ['handle-availability'], refetchType: 'all' });
    setRefreshVersion(version => version + 1);
  });

  useEffect(() => { captureReferralAttribution().catch(() => null); base44.analytics.track({ eventName: 'homepage_view', properties: { device: window.innerWidth < 1280 ? 'mobile' : 'desktop', source: new URLSearchParams(window.location.search).get('utm_source') || 'direct' } }); }, []);
  if (isMobile) return <main ref={pull.ref} data-mobile-scroll-panel className="home-funnel dark min-h-screen bg-hero-canvas"><PullRefreshStatus refreshing={pull.refreshing} distance={pull.distance} ready={pull.ready}/><Header onConnected={setWallet} funnel/><PublicHandleMintRecovery/><MobileMintHome wallet={wallet} refreshVersion={refreshVersion}/></main>;
  return <main className="home-funnel dark"><HomeBackdrop/><Header onConnected={setWallet} funnel/><PublicHandleMintRecovery/><HomeMintHero wallet={wallet}/><div className="home-content"><HomePayStory/></div><HomeHeroDemos/><div className="home-content"><HomeDesktopContent/></div></main>;
}