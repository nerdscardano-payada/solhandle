import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Users, ArrowUpRight } from 'lucide-react';
import { publicProfileRequest } from '@/components/solhandle/profile/publicProfileClient';
import ProfileDirectoryCard from '@/components/solhandle/profile/ProfileDirectoryCard';
import '@/components/solhandle/profile/profile-directory.css';

export default function EcosystemMobileProfiles() {
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width:767px)').matches);
  useEffect(() => {
    const media = window.matchMedia('(max-width:767px)');
    const update = () => setMobile(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const query = useQuery({ queryKey: ['ecosystem-public-profiles'], queryFn: () => publicProfileRequest({ action: 'list' }), enabled: mobile, staleTime: 30000, retry: false });
  if (!mobile) return null;
  const profiles = query.data?.items || [];
  return <section className="ep-card ep-projects">
    <div className="ep-card-heading"><h2><Users size={19}/>Profiles</h2><Link className="ep-link" to="/profiles">View all <ArrowUpRight size={14}/></Link></div>
    <p>Meet SolHandle owners and explore their public profiles.</p>
    {query.isPending ? <p role="status">Loading profiles…</p> : query.isError ? <div role="alert"><p>Profiles could not be loaded.</p><button className="ep-button" onClick={() => query.refetch()}>Try again</button></div> : profiles.length ? <div className="profile-directory-grid">{profiles.slice(0, 4).map(profile => <ProfileDirectoryCard key={profile.handle} profile={profile}/>)}</div> : <div className="ep-empty"><p>{query.data?.has_more ? 'Browse the directory to find more public profiles.' : 'No public profiles yet.'}</p><Link className="ep-link" to={query.data?.has_more ? '/profiles' : '/profile'}>{query.data?.has_more ? 'Explore profiles' : 'Set up my profile'}</Link></div>}
  </section>;
}