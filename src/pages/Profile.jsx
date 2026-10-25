import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { publicProfileRequest } from '@/components/solhandle/profile/publicProfileClient';
import useProfileIdentity from '@/components/solhandle/profile/useProfileIdentity';
import IdentityDetails from '@/components/solhandle/profile/IdentityDetails';
import HandleProfileEditor from '@/components/solhandle/profile/HandleProfileEditor';
import EcosystemLiveIdentity from '@/components/solhandle/ecosystem/live/EcosystemLiveIdentity';
import '@/components/solhandle/profile/profile.css';
import '@/components/solhandle/profile/profile-media.css';

export default function Profile() {
  const state = useProfileIdentity();
  const identity = state.error || state.identity?.address !== state.address ? null : state.identity;
  const [draft, setDraft] = useState(null);
  const handle = identity?.primaryHandle?.replace(/^@/, '') || '';
  const published = useQuery({ queryKey: ['public-handle-profile', handle], queryFn: () => publicProfileRequest({ action: 'public', handle }), enabled: !!handle, retry: false, staleTime: 0, refetchInterval: 30000 });
  const profile = draft?.wallet === state.address && draft?.handle === handle ? draft.profile : published.data?.profile;
  const updateProfile = (editedHandle, value) => setDraft({ wallet: state.address, handle: editedHandle, profile: value });
  return <main className="el-profile"><header className="ep-page-heading"><span className="ep-eyebrow">YOUR NAME. YOUR CORNER OF SOLANA.</span><h1>Identity</h1><p>Your connected wallet and its verified Primary Handle.</p></header><EcosystemLiveIdentity state={state} profile={profile} full/>{state.address && <IdentityDetails {...state} identity={identity}/>}{state.address && <HandleProfileEditor key={`${state.address}:${identity?.primaryHandle || ''}`} initialHandle={identity?.primaryHandle || ''} onProfileChange={updateProfile}/>}</main>;
}