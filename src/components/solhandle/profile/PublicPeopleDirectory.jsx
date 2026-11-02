import { useInfiniteQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { publicProfileRequest } from '@/components/solhandle/profile/publicProfileClient';
import ProfileDirectoryCard from '@/components/solhandle/profile/ProfileDirectoryCard';
import '@/components/solhandle/profile/profile-directory.css';
export default function PublicPeopleDirectory({ embedded = false }) {
  const Heading = embedded ? 'h2' : 'h1';
  const query = useInfiniteQuery({ queryKey: ['public-profile-directory'], initialPageParam: undefined,
    queryFn: ({ pageParam }) => publicProfileRequest({ action: 'list', ...(pageParam ? { cursor: pageParam } : {}) }),
    getNextPageParam: page => page.has_more ? page.next_cursor : undefined, staleTime: 0, retry: false });
  const profiles = query.isError ? [] : query.data?.pages.flatMap(page => page.items) || [];
  return <section className="profile-directory" aria-label="Public people directory"><header className="ep-page-heading"><span className="ep-eyebrow">MEET THE ECOSYSTEM</span><Heading>{embedded ? 'People' : 'Profiles'}</Heading><p>Only voluntarily published profiles with verified current ownership appear here.</p><Link to="/profile" className="ep-link">Manage my profile</Link></header>
    {query.isPending && <div className="handle-profile-panel" role="status">Loading profiles…</div>}
    {query.isError ? <section className="handle-profile-panel" role="alert"><p>Profiles could not be verified right now.</p><button className="ep-button" onClick={() => query.refetch()}>Try again</button></section> : <>
      {profiles.length > 0 && <div className="profile-directory-grid">{profiles.map(profile => <ProfileDirectoryCard key={profile.handle} profile={profile}/>)}</div>}
      {!query.isPending && !profiles.length && <section className="handle-profile-panel"><h2>{query.hasNextPage ? 'No verified profiles in this batch' : 'No public profiles yet'}</h2><p>{query.hasNextPage ? 'Load more to continue browsing.' : 'Handle owners can voluntarily publish their bio and links from My Identity.'}</p><Link className="ep-link" to="/profile">Set up my profile</Link></section>}
      {query.hasNextPage && <button className="ep-button profile-directory-more" disabled={query.isFetchingNextPage} onClick={() => query.fetchNextPage()}>{query.isFetchingNextPage ? 'Loading…' : 'Load more profiles'}</button>}
    </>}
  </section>;
}