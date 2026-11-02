import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { publicProfileRequest } from '@/components/solhandle/profile/publicProfileClient';
import HandleProfileEditor from '@/components/solhandle/profile/HandleProfileEditor';
import PostMintPrimary from '@/components/solhandle/onboarding/PostMintPrimary';
import PostMintExplore from '@/components/solhandle/onboarding/PostMintExplore';
const steps = [['primary', 'Primary Handle'], ['profile', 'Public profile'], ['contacts', 'Contacts'], ['pay', 'SolHandle Pay']];
export default function PostMintSteps({ wallet, handle, owned, onRefresh }) {
  const [params, setParams] = useSearchParams();
  const index = Math.max(0, steps.findIndex(([id]) => id === params.get('setup')));
  const [step] = steps[index];
  const go = next => setParams(previous => { const value = new URLSearchParams(previous); value.set('setup', steps[next][0]); return value; }, { preventScrollReset: true });
  const profile = useQuery({ queryKey: ['public-handle-profile', handle, wallet], queryFn: () => publicProfileRequest({ action: 'public', handle }), retry: false, staleTime: 0 });
  const item = owned.handles.find(value => value.handle.replace(/^@/, '') === handle);
  return <section className="ep-card post-mint" aria-label="Set up your SolHandle"><span className="ep-eyebrow">MAKE IT YOURS</span><h2>Your handle is just the beginning</h2><p>Set up your identity in four optional steps. You can skip any step and resume from My Handles.</p><nav className="post-mint-steps" aria-label="Identity setup steps">{steps.map(([id, label], position) => <button type="button" key={id} aria-current={step === id ? 'step' : undefined} onClick={() => go(position)}><span>{position + 1}.</span>{label}</button>)}</nav><p className="ep-small" role="status">Step {index + 1} of 4 · @{handle}</p>
    {step === 'primary' && <PostMintPrimary handle={handle} current={owned.primaryHandle} isPrimary={item?.isPrimary} onRefresh={onRefresh}/>}
    {step === 'profile' && <><h3>Give your handle a public face</h3><p>Add a photo, a bio of up to 100 characters and up to five website or social links. Publishing is optional.</p>{profile.isPending ? <p role="status">Checking published profile…</p> : profile.isError ? <p role="alert">Public profile status unavailable. <button className="ep-link" type="button" onClick={() => profile.refetch()}>Check again</button></p> : profile.data?.profile ? <p>Your profile is published. <Link className="ep-link" to={`/profile/${handle}`}>View public profile</Link></p> : <p>No verified public profile is published yet. Private saved details are only loaded after you sign.</p>}<HandleProfileEditor key={`${wallet}:${handle}`} initialHandle={handle} defaultOpen lockHandle onProfileChange={() => profile.refetch()}/></>}
    {(step === 'contacts' || step === 'pay') && <PostMintExplore step={step}/>}
    <footer className="post-mint-footer"><Link className="ep-link" to="/ecosystem">Skip setup for now</Link><div>{index > 0 && <button className="ep-link" type="button" onClick={() => go(index - 1)}>Back</button>}{index < steps.length - 1 ? <button className="ep-button ep-primary" type="button" onClick={() => go(index + 1)}>Continue / skip this step</button> : <Link className="ep-button ep-primary" to="/ecosystem">Go to my Ecosystem</Link>}</div></footer>
  </section>;
}