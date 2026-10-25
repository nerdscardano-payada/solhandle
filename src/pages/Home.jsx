import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';
import usePresentationMobile from '@/components/solhandle/design/usePresentationMobile';
import usePullToRefresh from '@/hooks/usePullToRefresh';
import PullRefreshStatus from '@/components/solhandle/PullRefreshStatus';
import PublicHandleMintRecovery from '@/components/solhandle/PublicHandleMintRecovery';
import PlatformLandingHeader from '@/components/solhandle/home/PlatformLandingHeader';
import PlatformHero from '@/components/solhandle/home/PlatformHero';
import PlatformLandingSteps from '@/components/solhandle/home/PlatformLandingSteps';
import { captureReferralAttribution } from '@/lib/referralAttribution';
import { base44 } from '@/api/base44Client';
import '@/components/solhandle/design/design-preview.css';
import '@/components/solhandle/design/hero-cinematic.css';
import '@/components/solhandle/design/hero-mobile-readability.css';
import '@/components/solhandle/home/platform-live.css';
import '@/components/solhandle/home/home-mobile-landing.css';

export default function Home() {
  const mobile = usePresentationMobile();
  const connectedWallet = useWallet();
  const wallet = connectedWallet.connected ? connectedWallet.publicKey?.toBase58() || '' : '';
  const client = useQueryClient();
  const [refreshVersion, setRefreshVersion] = useState(0);
  const pull = usePullToRefresh(async () => {
    await client.invalidateQueries({ queryKey: ['handle-availability'], refetchType: 'all' });
    setRefreshVersion(version => version + 1);
  });

  useEffect(() => { captureReferralAttribution().catch(() => null); base44.analytics.track({ eventName: 'homepage_view', properties: { device: window.innerWidth < 1280 ? 'mobile' : 'desktop', source: new URLSearchParams(window.location.search).get('utm_source') || 'direct' } }); }, []);
  return <main ref={pull.ref} data-mobile-scroll-panel className="sol-design platform-live dark" data-mode="dark"><PullRefreshStatus refreshing={pull.refreshing} distance={pull.distance} ready={pull.ready}/><div className={`sd-frame sd-public-frame ${mobile ? 'sd-phone' : ''}`}><div className="sd-screen"><PlatformLandingHeader/><PublicHandleMintRecovery/><PlatformHero wallet={wallet} refreshVersion={refreshVersion} mobile={mobile}/><PlatformLandingSteps/></div></div></main>;
}