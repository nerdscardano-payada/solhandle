import EcosystemLiveContacts from '@/components/solhandle/ecosystem/live/EcosystemLiveContacts';
import EcosystemMobileProfiles from '@/components/solhandle/ecosystem/live/EcosystemMobileProfiles';
import { useQuery } from '@tanstack/react-query';
import { publicProfileRequest } from '@/components/solhandle/profile/publicProfileClient';

import useProfileIdentity from '@/components/solhandle/profile/useProfileIdentity';
import EcosystemLiveIdentity from '@/components/solhandle/ecosystem/live/EcosystemLiveIdentity';
import useDashboardOwnership from '@/components/solhandle/ecosystem/live/useDashboardOwnership';
import DashboardNextAction from '@/components/solhandle/ecosystem/live/DashboardNextAction';
import DashboardGettingStarted from '@/components/solhandle/ecosystem/live/DashboardGettingStarted';
import useContacts from '@/components/solhandle/contacts/useContacts';
import '@/components/solhandle/ecosystem/live/dashboard-workspace.css';
import EcosystemLiveProjects from '@/components/solhandle/ecosystem/live/EcosystemLiveProjects';
import EcosystemLiveActions from '@/components/solhandle/ecosystem/live/EcosystemLiveActions';
export default function Ecosystem() {
  const state = useProfileIdentity();
  const ownership = useDashboardOwnership(state.address);
  const contacts = useContacts();
  const primary = !state.error && state.identity?.address === state.address ? state.identity?.primaryHandle : null;
  const handle = primary?.replace(/^@/, '') || '';
  const published = useQuery({ queryKey: ['public-handle-profile', handle, state.address], queryFn: () => publicProfileRequest({ action: 'public', handle }), enabled: !!handle, retry: false, staleTime: 0 });
  return <main className="ep-dashboard el-dashboard dashboard-workspace" key={state.address || 'disconnected'}><div className="ep-dashboard-main"><header className="ep-welcome"><div><p className="ep-eyebrow">SOLHANDLE ECOSYSTEM</p><h1>{primary ? `Welcome back, ${primary}` : 'Welcome to SolHandle'}</h1><p>{primary ? 'Your identity. Your network. Your Solana.' : state.address ? 'Start with your identity on Solana.' : 'Connect your wallet to access your personal workspace.'}</p></div></header><DashboardNextAction state={state} ownership={ownership} profileQuery={published}/><EcosystemLiveIdentity state={state} profile={published.isError ? null : published.data?.profile}/><EcosystemLiveActions/><DashboardGettingStarted state={state} ownership={ownership} profileQuery={published} contacts={contacts}/><EcosystemMobileProfiles/><div className="ep-dashboard-lower"><EcosystemLiveProjects compact/><EcosystemLiveContacts data={contacts}/></div></div></main>;
}