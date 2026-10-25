import { useNavigate } from 'react-router-dom';
import PublicHero from '@/components/solhandle/design/PublicHero';
import HandleSearch from '@/components/solhandle/HandleSearch';
import PlatformOverview from '@/components/solhandle/home/PlatformOverview';
import HomeMobileHero from '@/components/solhandle/home/HomeMobileHero';
import HomeMobileOverview from '@/components/solhandle/home/HomeMobileOverview';

export default function PlatformHero({ wallet, refreshVersion, mobile = false }) {
  const navigate = useNavigate();
  if (mobile) return <><HomeMobileHero wallet={wallet} refreshVersion={refreshVersion}/><HomeMobileOverview wallet={wallet}/></>;
  return <PublicHero onExplore={() => navigate('/network')} visualSlot={<PlatformOverview/>} searchSlot={<div id="claim-handle"><HandleSearch wallet={wallet} personalSearch compact funnel hideEmptyHint presentation="preview" refreshVersion={refreshVersion}/></div>}/>;
}