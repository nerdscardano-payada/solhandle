import useProfileIdentity from '@/components/solhandle/profile/useProfileIdentity';
import IdentityDetails from '@/components/solhandle/profile/IdentityDetails';
import HandleProfileEditor from '@/components/solhandle/profile/HandleProfileEditor';
import EcosystemLiveIdentity from '@/components/solhandle/ecosystem/live/EcosystemLiveIdentity';
import '@/components/solhandle/profile/profile.css';

export default function Profile() {
  const state = useProfileIdentity();
  const identity = state.error ? null : state.identity;
  return <main className="el-profile"><header className="ep-page-heading"><span className="ep-eyebrow">YOUR NAME. YOUR CORNER OF SOLANA.</span><h1>Identity</h1><p>Your connected wallet and its verified Primary Handle.</p></header><EcosystemLiveIdentity state={state} full/>{state.address && <IdentityDetails {...state} identity={identity}/>}{state.address && <HandleProfileEditor key={`${state.address}:${identity?.primaryHandle || ''}`} initialHandle={identity?.primaryHandle || ''}/>}</main>;
}