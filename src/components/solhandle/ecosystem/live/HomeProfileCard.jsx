import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import ProfileAvatar from '@/components/solhandle/profile/ProfileAvatar';
import HomeHandleNft from '@/components/solhandle/ecosystem/live/HomeHandleNft';
import '@/components/solhandle/profile/profile-media.css';

export default function HomeProfileCard({ profile }) {
  return <article className="profile-directory-card home-profile-card">
    <div className="home-profile-body">
      <div className="home-profile-person">
        <div className="profile-directory-heading">
          <ProfileAvatar avatar={profile.avatar} handle={profile.handle} mintFallback={false} className="profile-directory-avatar"/>
          <h3>@{profile.handle}</h3>
        </div>
        <p className="home-profile-bio">{profile.bio || 'View this public SolHandle profile.'}</p>
      </div>
      <HomeHandleNft key={`${profile.assetAddress}-${profile.mintImage}`} profile={profile}/>
    </div>
    <span className="home-profile-checked"><ShieldCheck size={14} aria-hidden="true"/>NFT ownership checked</span>
    <Link to={`/profile/${profile.handle}`} className="ep-link">View profile <ArrowUpRight size={16} aria-hidden="true"/></Link>
  </article>;
}