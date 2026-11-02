import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck, Star } from 'lucide-react';
import ProfileAvatar from '@/components/solhandle/profile/ProfileAvatar';
import HomeHandleNft from '@/components/solhandle/ecosystem/live/HomeHandleNft';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import '@/components/solhandle/profile/profile-media.css';
import '@/components/solhandle/profile/profile-identity-card.css';

export default function ProfileIdentityCard({ profile, variant = 'featured' }) {
  return <TooltipProvider><article className={`profile-directory-card home-profile-card identity-card--${variant}`}>
    <div className="home-profile-body">
      <div className="home-profile-person">
        <div className="profile-directory-heading">
          <ProfileAvatar avatar={profile.avatar} handle={profile.handle} mintFallback={false} className="profile-directory-avatar"/>
          <h3>@{profile.handle}{variant === 'directory' && profile.primaryActive && <Tooltip><TooltipTrigger asChild><span className="identity-primary-star" tabIndex={0} aria-label="Primary handle"><Star size={12} aria-hidden="true"/></span></TooltipTrigger><TooltipContent className="max-w-64 bg-ecosystem-raised text-ecosystem-text">The wallet owner selected this as their primary on-chain handle.</TooltipContent></Tooltip>}</h3>
        </div>
        <p className="home-profile-bio">{profile.bio || 'View this public SolHandle profile.'}</p>
        {profile.ownershipChecked === true && <Tooltip><TooltipTrigger asChild><span tabIndex={0} className="home-profile-checked"><ShieldCheck size={13} aria-hidden="true"/>{variant === 'directory' ? 'Ownership checked' : 'On-chain ownership checked'}</span></TooltipTrigger><TooltipContent className="max-w-64 bg-ecosystem-raised text-ecosystem-text">NFT ownership is checked on Solana. This is not personal identity verification.</TooltipContent></Tooltip>}
        <Link to={`/profile/${profile.handle}`} className="ep-link home-profile-link" aria-label={`View profile @${profile.handle}`}>View profile <ArrowUpRight size={15} aria-hidden="true"/></Link>
      </div>
      <HomeHandleNft key={`${profile.assetAddress}-${profile.mintImage}`} profile={profile}/>
    </div>
  </article></TooltipProvider>;
}