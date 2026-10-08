import RecentHandles from '@/components/solhandle/RecentHandles';
import LatestMarketplaceListings from '@/components/solhandle/LatestMarketplaceListings';
import HomeActions from '@/components/solhandle/home/HomeActions';
import HomeFaq from '@/components/solhandle/home/HomeFaq';
import HomeTokenFlywheel from '@/components/solhandle/home/HomeTokenFlywheel';

export default function HomeDesktopContent() {
  return <><HomeTokenFlywheel/><HomeActions/><div className="home-content-section home-activity-grid"><RecentHandles/><LatestMarketplaceListings/></div><HomeFaq/></>;
}