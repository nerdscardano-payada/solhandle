import HeroEcosystemVisual from '@/components/solhandle/design/HeroEcosystemVisual';
import LiveHeroSocial from '@/components/solhandle/home/LiveHeroSocial';
import LiveHeroIdentity from '@/components/solhandle/home/LiveHeroIdentity';
import LiveHeroPay from '@/components/solhandle/home/LiveHeroPay';

export default function PlatformOverview() {
  return <HeroEcosystemVisual footer="Social · Identity · Pay"><LiveHeroSocial/><LiveHeroIdentity/><LiveHeroPay/></HeroEcosystemVisual>;
}