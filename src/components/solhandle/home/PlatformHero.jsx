import { useNavigate } from 'react-router-dom';
import PublicHero from '@/components/solhandle/design/PublicHero';
import HandleSearch from '@/components/solhandle/HandleSearch';
import PlatformOverview from '@/components/solhandle/home/PlatformOverview';

export default function PlatformHero({ wallet, refreshVersion }) {
  const navigate = useNavigate();
  return <PublicHero onExplore={() => navigate('/network')} visualSlot={<PlatformOverview/>} searchSlot={<div id="claim-handle"><HandleSearch wallet={wallet} personalSearch compact funnel hideEmptyHint presentation="preview" refreshVersion={refreshVersion}/></div>}/>;
}