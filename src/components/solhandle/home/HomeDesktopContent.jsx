import RecentHandles from '@/components/solhandle/RecentHandles';
import LatestMarketplaceListings from '@/components/solhandle/LatestMarketplaceListings';
import HomeActions from '@/components/solhandle/home/HomeActions';
import HomeFaq from '@/components/solhandle/home/HomeFaq';
import HomeTokenFlywheel from '@/components/solhandle/home/HomeTokenFlywheel';
import { useSyncExternalStore } from 'react';
import HomeMobileContent from '@/components/solhandle/home/HomeMobileContent';

const mobileQuery = window.matchMedia('(max-width:767px)');
const subscribe = callback => {
  mobileQuery.addEventListener('change', callback);
  return () => mobileQuery.removeEventListener('change', callback);
};
const getSnapshot = () => mobileQuery.matches;

export default function HomeDesktopContent() {
  const isMobile = useSyncExternalStore(subscribe, getSnapshot);
  if (isMobile) return <HomeMobileContent />;
  return <><HomeTokenFlywheel/><HomeActions/><div className="home-content-section home-activity-grid"><RecentHandles/><LatestMarketplaceListings/></div><HomeFaq/></>;
}