import HomeMobileIdentity from '@/components/solhandle/home/HomeMobileIdentity';
import LiveHeroSocial from '@/components/solhandle/home/LiveHeroSocial';
import ClaimTokenNote from '@/components/solhandle/design/ClaimTokenNote';

export default function HomeMobileOverview({ wallet }) {
  return <div className="home-mobile-overview">
    {wallet && <HomeMobileIdentity key={wallet}/>}
    <LiveHeroSocial/>
    <ClaimTokenNote/>
  </div>;
}