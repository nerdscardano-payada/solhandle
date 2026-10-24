import { UserRound } from 'lucide-react';
import ProfileHeaderLayout from '@/components/solhandle/profile/ProfileHeaderLayout';

export default function NetworkProfileFrame({ profile, label, banner, avatar, actions, identity, meta, share, counts, children, onIdentity }) {
  return <ProfileHeaderLayout
    classes={{ cover: 'sd-profile-banner', intro: 'sd-profile-intro network-profile-hero', top: 'sd-profile-top', avatar: 'sd-avatar sd-avatar-profile', actions: 'sd-profile-actions' }}
    banner={banner || <><span>SOCIAL / IDENTITY / PAY</span><div aria-hidden="true">@</div></>}
    avatar={avatar || profile.name?.charAt(0).toLowerCase() || <UserRound size={40}/>}
    actions={actions}
  >
      <span className="sd-eyebrow">{profile.kind} · {label}</span>
      <h1>{profile.name}</h1>
      {profile.handle && <button type="button" className="sd-profile-primary-handle" onClick={onIdentity} data-no-translate>{profile.handle}</button>}
      {identity}
      <p className="sd-profile-bio whitespace-pre-wrap break-words">{profile.bio || 'No bio added.'}</p>
      {meta && <div className="sd-profile-meta">{meta}</div>}
      {share && <div className="mt-4">{share}</div>}
      <div className="sd-profile-counts">{counts}</div>
      {children}
  </ProfileHeaderLayout>;
}