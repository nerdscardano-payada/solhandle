import { Link } from 'react-router-dom';
import { ArrowUpRight, UserRound } from 'lucide-react';
import { profilePath } from '@/components/solhandle/network/networkClient';
export default function NetworkProfileCard({ profile }) {
  return <article className="sd-person-card"><span className="sd-avatar">{profile.name?.charAt(0).toLowerCase() || <UserRound size={24}/>}</span><small>{profile.kind} · PUBLIC PROFILE</small><h3>{profile.name}</h3>{profile.handle && <span data-no-translate>{profile.handle}</span>}<p className="whitespace-pre-wrap break-words">{profile.bio || 'No bio added.'}</p><div><Link to={profilePath(profile)} className="sd-button sd-secondary">Profile <ArrowUpRight size={14}/></Link></div></article>;
}