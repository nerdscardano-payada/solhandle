import RecentHandles from '@/components/solhandle/RecentHandles';
import HomeFaq from '@/components/solhandle/home/HomeFaq';
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
  return <><div className="home-content-section"><RecentHandles limit={4} fourAcross/></div><HomeFaq paymentFirst/></>;
}