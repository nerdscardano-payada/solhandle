import RecentHandles from '@/components/solhandle/RecentHandles';
import LatestMarketplaceListings from '@/components/solhandle/LatestMarketplaceListings';
import HomeActions from '@/components/solhandle/home/HomeActions';
import HomeFaq from '@/components/solhandle/home/HomeFaq';

export default function HomeDesktopContent() {
  return <><HomeActions/><div className="home-content-section home-activity-grid"><RecentHandles/><LatestMarketplaceListings/></div><HomeFaq/></>;
}