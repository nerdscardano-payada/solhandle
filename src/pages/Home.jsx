import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import usePullToRefresh from '@/hooks/usePullToRefresh';
import PullRefreshStatus from '@/components/solhandle/PullRefreshStatus';
import PublicHandleMintRecovery from '@/components/solhandle/PublicHandleMintRecovery';
import EcosystemPublicHero from '@/components/solhandle/ecosystem/live/EcosystemPublicHero';
import HomeIntegrationHero from '@/components/solhandle/ecosystem/live/HomeIntegrationHero';
import HomeEcosystemPillars from '@/components/solhandle/ecosystem/live/HomeEcosystemPillars';
import HomePublicProfiles from '@/components/solhandle/ecosystem/live/HomePublicProfiles';
import HomeProtocolStats from '@/components/solhandle/ecosystem/live/HomeProtocolStats';
import HomeHowItWorks from '@/components/solhandle/ecosystem/live/HomeHowItWorks';
import MobileHomeDisclosure from '@/components/solhandle/ecosystem/live/MobileHomeDisclosure';
import EcosystemLiveProjects from '@/components/solhandle/ecosystem/live/EcosystemLiveProjects';
import { captureReferralAttribution } from '@/lib/referralAttribution';
import { base44 } from '@/api/base44Client';
export default function Home() {
  const client = useQueryClient(), location = useLocation();
  const params = new URLSearchParams(location.search);
  const pull = usePullToRefresh(() => Promise.all([client.invalidateQueries({ queryKey: ['handle-availability'] }), client.invalidateQueries({ queryKey: ['network-projects'] })]));
  useEffect(() => { captureReferralAttribution().catch(() => null); base44.analytics.track({ eventName: 'homepage_view', properties: { device: window.innerWidth < 1280 ? 'mobile' : 'desktop', source: new URLSearchParams(window.location.search).get('utm_source') || 'direct' } }); }, []);
  if (params.has('claim') || params.has('official_claim')) return <Navigate to={`/search${location.search}`} replace/>;
  return <main ref={pull.ref} data-mobile-scroll-panel className="ep-public"><PullRefreshStatus refreshing={pull.refreshing} distance={pull.distance} ready={pull.ready}/><PublicHandleMintRecovery/><EcosystemPublicHero/><div className="ep-public-content"><MobileHomeDisclosure variant="how" title="How SolHandle Works" summary="Find, claim and use your @handle."><HomeHowItWorks/></MobileHomeDisclosure><HomeEcosystemPillars/><HomePublicProfiles/><EcosystemLiveProjects compact/></div><MobileHomeDisclosure variant="developers" title="For developers" summary="SDK, API and integration guides."><HomeIntegrationHero/></MobileHomeDisclosure><div className="ep-public-content"><MobileHomeDisclosure variant="stats" title="SolHandle in numbers" summary="Protocol statistics and recent mints."><HomeProtocolStats/></MobileHomeDisclosure></div></main>;
}