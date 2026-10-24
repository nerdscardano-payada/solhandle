import { UserRound } from 'lucide-react';

export default function NetworkProfileFrame({ profile, label, banner, avatar, actions, identity, meta, share, counts, children }) {
  return <>
    <div className="network-profile-cover">
      {banner || <div className="network-profile-cover-empty" aria-hidden="true"><span>SOCIAL / IDENTITY / PAY</span><strong>@</strong></div>}
    </div>
    <header className="network-profile-hero network-profile-composition">
      <div className="network-profile-top-row">
        <div className="network-avatar-frame"><div className="network-avatar-inner">{avatar || <UserRound className="h-12 w-12 text-names-accent" aria-hidden="true"/>}</div></div>
        <div className="network-profile-primary-actions">{actions}</div>
      </div>
      <p className="text-xs uppercase tracking-widest text-identity-muted">{profile.kind} · {label}</p>
      <h1 className="network-profile-display-name">{profile.name}</h1>
      {profile.handle && <p className="mb-3 break-words text-base text-names-accent" data-no-translate>{profile.handle}</p>}
      {identity}
      <p className="mt-4 max-w-2xl whitespace-pre-wrap break-words text-sm leading-relaxed text-identity-text">{profile.bio || 'No bio added.'}</p>
      {meta && <div className="network-profile-metadata">{meta}</div>}
      {share && <div className="mt-4">{share}</div>}
      <div className="network-profile-counts">{counts}</div>
      {children}
    </header>
  </>;
}