import { useQuery } from '@tanstack/react-query';
import { Shield, RefreshCw } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';
import ProfileAvatar from '@/components/solhandle/profile/ProfileAvatar';
import IdentityMintTablet from '@/components/solhandle/profile/IdentityMintTablet';
import HandleDetailRecord from '@/components/solhandle/handles/HandleDetailRecord';
import IdentityCopy from '@/components/solhandle/profile/IdentityCopy';
import SaveProfileContact from '@/components/solhandle/profile/SaveProfileContact';
import { ecosystemAssets } from '@/components/solhandle/ecosystem/live/ecosystemRoutes';
import '@/components/solhandle/handles/handle-detail.css';
import '@/components/solhandle/profile/profile.css';
import '@/components/solhandle/profile/public-profile-card.css';

export default function PublicProfileCard({ profile }) {
  const query = useQuery({ queryKey: ['public-profile-handle-details', profile.handle], queryFn: async () => (await base44.functions.invoke('getHandleAvailability', { handle: profile.handle })).data, retry: false, staleTime: 0 });
  const data = query.data, owner = data?.currentOwner;
  return <div className="public-profile-layout">
    <div className="public-profile-banner"><Image src={ecosystemAssets.city} alt="SolHandle city banner" className="h-full w-full" focalPointX={0.74}/></div>
    <div className="public-profile-original-grid">
      <section className="handle-profile-panel public-profile-summary !mt-0" aria-label="Public handle profile">
        <div className="public-profile-personal"><ProfileAvatar avatar={profile.avatar} handle={profile.handle}/><div className="min-w-0"><h1>@{profile.handle}</h1><p className="handle-profile-bio !mt-4">{profile.bio || 'No bio added.'}</p></div></div>
        <div className="public-profile-social-actions">
          <div className="handle-profile-links">{profile.social_links.map((url, index) => <a key={`${index}-${url}`} href={url} target="_blank" rel="noopener noreferrer nofollow ugc">{url}</a>)}</div>
          <SaveProfileContact key={profile.handle} handle={profile.handle} quiet/>
        </div>
      </section>
      <section className="public-profile-ownership" aria-label="On-chain handle ownership">
        <div className="ep-ownership" role="status"><Shield size={21}/><div><strong>{query.isPending ? 'Checking Solana…' : query.isError || !owner ? 'Ownership not confirmed' : 'Handle ownership checked on-chain'}</strong><p>Handle ownership is not personal identity or Official Project verification.</p></div></div>
        {query.isPending ? <p role="status">Loading handle details…</p> : query.isError ? <p role="alert">Handle details could not be loaded.</p> : <dl><div><dt>Handle</dt><dd>@{profile.handle}</dd></div><div><dt>Wallet</dt><dd>{owner ? <>{owner.slice(0, 6)}…{owner.slice(-4)}<IdentityCopy value={owner} label="Copy wallet address"/></> : 'Not verified'}</dd></div>{owner && <div><dt>Last checked</dt><dd>{new Date(query.dataUpdatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</dd></div>}</dl>}
        <button type="button" className="ep-link" disabled={query.isFetching} onClick={() => query.refetch()}><RefreshCw size={14} className={query.isFetching ? 'animate-spin' : ''}/>{query.isFetching ? 'Checking…' : 'Refresh identity'}</button>
      </section>
      <div className="public-profile-record"><HandleDetailRecord handle={profile.handle} data={data} owner={owner} invalid={data?.status === 'INVALID'} available={data?.available}/></div>
      <section className="handle-profile-panel !mt-0"><h2>Handle mint artwork</h2><IdentityMintTablet handle={profile.handle}/></section>
    </div>
  </div>;
}