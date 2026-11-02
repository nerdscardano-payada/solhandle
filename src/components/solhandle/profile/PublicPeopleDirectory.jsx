import { useState } from 'react';
import { Search } from 'lucide-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { publicProfileRequest } from '@/components/solhandle/profile/publicProfileClient';
import ProfileDirectoryCard from '@/components/solhandle/profile/ProfileDirectoryCard';
import '@/components/solhandle/profile/profile-directory.css';
export default function PublicPeopleDirectory({ embedded = false }) {
  const Heading = embedded ? 'h2' : 'h1';
  const [search, setSearch] = useState(''), [q, setQ] = useState('');
  const query = useInfiniteQuery({ queryKey: ['public-profile-directory', 'directory-artwork', q], initialPageParam: undefined,
    queryFn: ({ pageParam }) => publicProfileRequest({ action: 'list', variant: 'directory', include_mint_artwork: true, q, ...(pageParam ? { cursor: pageParam } : {}) }),
    getNextPageParam: page => page.has_more ? page.next_cursor : undefined, staleTime: 0, retry: false });
  const profiles = query.isError ? [] : query.data?.pages.flatMap(page => page.items) || [];
  return <section className="profile-directory people-directory" aria-label="Public people directory"><header className="ep-page-heading"><span className="ep-eyebrow">MEET THE ECOSYSTEM</span><Heading>{embedded ? 'People' : 'Profiles'}</Heading><p>Discover people and their Solana identities.</p><Link to="/profile" className="ep-link">Manage my profile</Link></header>
    <form className="ep-search-field people-directory-search" role="search" onSubmit={event => { event.preventDefault(); setQ(search.trim()); }}><Search size={18} aria-hidden="true"/><input aria-label="Search people or handles" placeholder="Search people or @handles…" value={search} maxLength={80} onChange={event => { setSearch(event.target.value); if (!event.target.value) setQ(''); }}/><button className="ep-link" type="submit">Search</button></form>
    {query.isPending && <div className="handle-profile-panel" role="status">Loading profiles…</div>}
    {query.isError ? <section className="handle-profile-panel" role="alert"><p>Profiles could not be verified right now.</p><button className="ep-button" onClick={() => query.refetch()}>Try again</button></section> : <>
      {profiles.length > 0 && <div className="profile-directory-grid">{profiles.map(profile => <ProfileDirectoryCard key={profile.handle} profile={profile}/>)}</div>}
      {!query.isPending && !profiles.length && <section className="handle-profile-panel"><h2>{query.hasNextPage ? 'No verified profiles in this batch' : q ? 'No matching profiles' : 'No public profiles yet'}</h2><p>{query.hasNextPage ? 'Load more to continue browsing.' : q ? 'Try another handle or a word from a biography.' : 'Handle owners can voluntarily publish their bio and links from My Identity.'}</p>{!q && <Link className="ep-link" to="/profile">Set up my profile</Link>}</section>}
      {query.hasNextPage && <button className="ep-button profile-directory-more" disabled={query.isFetchingNextPage} onClick={() => query.fetchNextPage()}>{query.isFetchingNextPage ? 'Loading…' : 'Load more profiles'}</button>}
    </>}
  </section>;
}