import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';
import { publicProfileRequest } from '@/components/solhandle/profile/publicProfileClient';
import HomeProfileCard from '@/components/solhandle/ecosystem/live/HomeProfileCard';
import '@/components/solhandle/profile/profile-directory.css';
import '@/components/solhandle/ecosystem/live/home-activation.css';

export default function HomePublicProfiles() {
  const query = useQuery({ queryKey: ['homepage-public-profiles', 'mint-artwork'], queryFn: () => publicProfileRequest({ action: 'list', include_mint_artwork: true }), staleTime: 0, gcTime: 0, retry: false });
  const profiles = query.isError ? [] : (query.data?.items || []).slice(0, 6);
  return <section className="home-public-profiles" aria-labelledby="home-people-title">
    <header className="ep-public-intro"><span className="ep-eyebrow">MEET THE ECOSYSTEM</span><h2 id="home-people-title">Meet the people behind the @handles.</h2><p>Explore voluntarily published profiles. Ownership is checked on Solana before a profile is returned, not inferred from a saved name.</p></header>
    {query.isPending ? <p role="status">Checking public profiles and current ownership…</p> : query.isError ? <div role="alert"><p>Public profiles could not be verified right now.</p><button type="button" className="ep-button" onClick={() => query.refetch()} disabled={query.isFetching}>{query.isFetching ? 'Checking…' : 'Try again'}</button></div> : profiles.length ? <>
      <p className="home-ownership-note"><ShieldCheck size={16} aria-hidden="true"/>Ownership checked for this selection. This is not personal identity verification.</p>
      <div className="profile-directory-grid">{profiles.map(profile => <HomeProfileCard key={profile.handle} profile={profile}/>)}</div>
    </> : <div className="ep-card"><p>{query.data?.has_more ? 'No verified profiles in this selection. Browse the directory to continue.' : 'No verified public profiles are available yet. Handle owners can voluntarily publish their profile.'}</p><Link className="ep-link" to="/profile">Create my public profile</Link></div>}
    <Link className="ep-link home-profiles-more" to="/profiles">Explore All Profiles <ArrowUpRight size={16}/></Link>
  </section>;
}