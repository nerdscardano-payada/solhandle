import { Link } from 'react-router-dom';
import { Send, ExternalLink, Fingerprint } from 'lucide-react';
import { Image } from '@/components/ui/image';
import ProfileAvatar from '@/components/solhandle/profile/ProfileAvatar';
import IdentityMintPhone from '@/components/solhandle/profile/IdentityMintPhone';
import SaveProfileContact from '@/components/solhandle/profile/SaveProfileContact';
import PublicProfileDetails from '@/components/solhandle/profile/PublicProfileDetails';
import { ecosystemAssets } from '@/components/solhandle/ecosystem/live/ecosystemRoutes';
import '@/components/solhandle/profile/public-profile-card.css';

export default function PublicProfileCard({ profile }) {
  return <div className="public-profile-layout">
    <section className="handle-profile-panel public-profile-card !mt-0" aria-label="Public handle profile">
      <div className="public-profile-banner"><Image src={ecosystemAssets.city} alt="" className="h-full w-full" focalPointX={0.74}/><span>YOUR NAME. YOUR CORNER OF SOLANA.</span></div>
      <div className="public-profile-section-heading"><Fingerprint size={20}/><h2>Identity Profile</h2></div>
      <div className="public-profile-card-body">
        <div className="public-profile-personal">
          <ProfileAvatar avatar={profile.avatar} handle={profile.handle}/>
          <div className="public-profile-introduction">
            <h1>@{profile.handle}</h1>
            <p className="public-profile-caption">Your wallet-owned SolHandle</p>
            <div className="ep-tags"><span>Solana Mainnet</span></div>
            <p className="handle-profile-bio">{profile.bio || 'No bio added.'}</p>
            {!!profile.social_links.length && <nav className="public-profile-socials" aria-label="Profile links">{profile.social_links.map((url, index) => <a className="ep-link" key={`${index}-${url}`} href={url} target="_blank" rel="noopener noreferrer nofollow ugc"><ExternalLink size={16}/>{new URL(url).hostname.replace(/^www\./, '')}</a>)}</nav>}
            <Link className="ep-link" to={`/${profile.handle}`}>View handle <ExternalLink size={14}/></Link>
          </div>
        </div>
        <div className="public-profile-actions"><SaveProfileContact key={profile.handle} handle={profile.handle} inlineAction={<Link className="ep-button" to="/pay" state={{ profileHandle: profile.handle }}><Send size={16}/>Pay</Link>}/></div>
      </div>
    </section>
    <section className="handle-profile-panel public-profile-wallet !mt-0" aria-label="On-chain identity and mint artwork">
      <div className="public-profile-technical"><PublicProfileDetails handle={profile.handle}/></div>
      <div className="public-profile-artwork"><IdentityMintPhone handle={profile.handle} caption="Handle mint artwork"/></div>
    </section>
  </div>;
}