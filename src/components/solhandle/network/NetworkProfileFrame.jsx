import { UserRound, Fingerprint } from 'lucide-react';
import '@/components/solhandle/design/profile-identity-preview.css';
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
      <button type="button" className="sd-profile-primary-handle" onClick={onIdentity} aria-label="View the primary handle under Identity" data-no-translate><Fingerprint size={16}/>{profile.handle || 'No primary handle yet'}</button>
      <p className="sd-profile-bio whitespace-pre-wrap break-words">{profile.bio || 'No bio added.'}</p>
      {meta && <div className="sd-profile-meta">{meta}</div>}
      {share}
      <div className="sd-profile-counts">{counts}</div>
      {(identity || children) && <details className="sd-profile-status"><summary>Ownership & payment status</summary>{identity}{children}</details>}
  </ProfileHeaderLayout>;
}