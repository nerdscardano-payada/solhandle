import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { publicProfileRequest } from '@/components/solhandle/profile/publicProfileClient';
import '@/components/solhandle/profile/public-profile.css';
import ProfileAvatar from '@/components/solhandle/profile/ProfileAvatar';
import PublicProfileDetails from '@/components/solhandle/profile/PublicProfileDetails';
import SaveProfileContact from '@/components/solhandle/profile/SaveProfileContact';
import '@/components/solhandle/profile/profile-media.css';
export default function HandlePublicProfile({ handle, standalone = false }) {
  const query = useQuery({ queryKey: ['public-handle-profile', handle], queryFn: () => publicProfileRequest({ action: 'public', handle }), enabled: !!handle, retry: false, staleTime: 0, refetchInterval: 30000 });
  if (query.isPending) return <section className="handle-profile-panel" role="status">Checking public profile…</section>;
  if (query.isError) return <section className="handle-profile-panel" role="alert">Public profile could not be verified. <button className="ep-link" onClick={() => query.refetch()}>Retry</button></section>;
  const profile = query.data?.profile;
  if (!profile) return standalone ? <section className="handle-profile-panel"><h2>Profile unavailable</h2><p>This handle does not currently have a verified, published profile.</p><Link className="ep-link" to={`/${handle}`}>View handle</Link></section> : null;
  const summary = <section className={`handle-profile-panel ${standalone ? '!mt-0' : ''}`} aria-label="Public handle profile"><div className="flex items-center gap-5"><ProfileAvatar avatar={profile.avatar} handle={profile.handle}/><div className="min-w-0">{standalone ? <div className="ep-page-heading min-w-0"><h1>@{profile.handle}</h1></div> : <h2>@{profile.handle}</h2>}<p className="handle-profile-bio !mt-4">{profile.bio || 'No bio added.'}</p></div></div><div className="handle-profile-links">{profile.social_links.map((url, index) => <a key={`${index}-${url}`} href={url} target="_blank" rel="noopener noreferrer nofollow ugc">{url}</a>)}</div><SaveProfileContact key={profile.handle} handle={profile.handle}/>{!standalone && <div className="profile-actions"><Link to={`/profile/${profile.handle}`}>Open public profile</Link></div>}</section>;
  return standalone ? <PublicProfileDetails key={profile.handle} handle={profile.handle}>{summary}</PublicProfileDetails> : summary;
}