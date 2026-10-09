import RecentHandles from '@/components/solhandle/RecentHandles';
import HomeFaq from '@/components/solhandle/home/HomeFaq';
import HomeMobileToken from '@/components/solhandle/home/HomeMobileToken';
import '@/components/solhandle/home/home-mobile-mint.css';

export default function HomeMobileContent() {
  return <><section className="home-content-section"><RecentHandles limit={6} /></section><HomeMobileToken /><HomeFaq /></>;
}