import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';
import ProfileAvatar from '@/components/solhandle/profile/ProfileAvatar';
import HandleCard from '@/components/solhandle/HandleCard';
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
        <div className="handle-profile-links">{profile.social_links.map((url, index) => <a key={`${index}-${url}`} href={url} target="_blank" rel="noopener noreferrer nofollow ugc">{url}</a>)}</div>
        <SaveProfileContact key={profile.handle} handle={profile.handle} quiet/>
      </section>
      <section className="handle-profile-panel !mt-0"><h2>Wallet &amp; handle</h2><p>Solana Mainnet</p>
        {query.isPending ? <p role="status">Loading handle details…</p> : query.isError ? <p role="alert">Handle details could not be loaded. <button className="ep-link" onClick={() => query.refetch()}>Retry</button></p> : owner && <div className="identity-address"><span className="identity-eyebrow">CURRENT OWNER WALLET</span><div><code>{owner}</code><IdentityCopy value={owner} label="Copy wallet address"/></div><a className="ep-link" href={`https://solscan.io/account/${owner}`} target="_blank" rel="noopener noreferrer">View wallet on Solscan</a></div>}
      </section>
      <div className="public-profile-record"><HandleDetailRecord handle={profile.handle} data={data} owner={owner} invalid={data?.status === 'INVALID'} available={data?.available}/></div>
      <section className="handle-profile-panel !mt-0"><h2>Handle mint artwork</h2><HandleCard handle={profile.handle}/></section>
    </div>
  </div>;
}