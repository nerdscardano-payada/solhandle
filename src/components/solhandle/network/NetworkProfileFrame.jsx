import { UserRound } from 'lucide-react';
import ProfileHeaderLayout from '@/components/solhandle/profile/ProfileHeaderLayout';

export default function NetworkProfileFrame({ profile, label, banner, avatar, actions, identity, meta, share, counts, children }) {
  return <ProfileHeaderLayout
    classes={{ cover: 'network-profile-cover', intro: 'network-profile-hero network-profile-composition', top: 'network-profile-top-row', avatar: 'network-avatar-frame', actions: 'network-profile-primary-actions' }}
    banner={banner || <div className="network-profile-cover-empty" aria-hidden="true"><span>SOCIAL / IDENTITY / PAY</span><strong>@</strong></div>}
    avatar={<div className="network-avatar-inner">{avatar || <UserRound className="h-12 w-12 text-names-accent" aria-hidden="true"/>}</div>}
    actions={actions}
  >
      <p className="text-xs uppercase tracking-widest text-identity-muted">{profile.kind} · {label}</p>
      <h1 className="network-profile-display-name">{profile.name}</h1>
      {profile.handle && <p className="mb-3 break-words text-base text-names-accent" data-no-translate>{profile.handle}</p>}
      {identity}
      <p className="mt-4 max-w-2xl whitespace-pre-wrap break-words text-sm leading-relaxed text-identity-text">{profile.bio || 'No bio added.'}</p>
      {meta && <div className="network-profile-metadata">{meta}</div>}
      {share && <div className="mt-4">{share}</div>}
      <div className="network-profile-counts">{counts}</div>
      {children}
  </ProfileHeaderLayout>;
}