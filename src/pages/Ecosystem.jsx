import EcosystemLiveContacts from '@/components/solhandle/ecosystem/live/EcosystemLiveContacts';
import { useQuery } from '@tanstack/react-query';
import { publicProfileRequest } from '@/components/solhandle/profile/publicProfileClient';

import useProfileIdentity from '@/components/solhandle/profile/useProfileIdentity';
import EcosystemLiveIdentity from '@/components/solhandle/ecosystem/live/EcosystemLiveIdentity';
import EcosystemLiveSummary from '@/components/solhandle/ecosystem/live/EcosystemLiveSummary';
import EcosystemLiveProjects from '@/components/solhandle/ecosystem/live/EcosystemLiveProjects';
import EcosystemLiveActions from '@/components/solhandle/ecosystem/live/EcosystemLiveActions';
export default function Ecosystem() {
  const state = useProfileIdentity();
  const primary = !state.error && state.identity?.address === state.address ? state.identity?.primaryHandle : null;
  const handle = primary?.replace(/^@/, '') || '';
  const published = useQuery({ queryKey: ['public-handle-profile', handle], queryFn: () => publicProfileRequest({ action: 'public', handle }), enabled: !!handle, retry: false, staleTime: 0, refetchInterval: 30000 });
  return <main className="ep-dashboard el-dashboard"><div className="ep-dashboard-main"><header className="ep-welcome"><div><p className="ep-eyebrow">YOUR SOLANA, CONNECTED.</p><h1>{primary ? `Welcome, ${primary}.` : 'Make yourself at home.'}</h1><p>One identity. A world of possibilities.</p></div></header><EcosystemLiveSummary state={state}/><EcosystemLiveIdentity state={state} profile={published.data?.profile}/><div className="el-mobile-actions"><EcosystemLiveActions/></div><div className="ep-dashboard-lower"><EcosystemLiveProjects compact/><EcosystemLiveContacts/></div></div></main>;
}