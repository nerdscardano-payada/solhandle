import { Link } from 'react-router-dom';
import { ArrowUpRight, UserRound } from 'lucide-react';
import { profilePath } from '@/components/solhandle/network/networkClient';
export default function NetworkProfileCard({ profile }) {
  return <Link to={profilePath(profile)} className="network-person-card group flex gap-4 p-5"><span className="network-post-avatar flex h-12 w-12 shrink-0 items-center justify-center text-names-accent"><UserRound className="h-6 w-6"/></span><div className="min-w-0 flex-1"><h3 className="truncate font-semibold">{profile.name}</h3><p className="mt-1 text-xs uppercase tracking-wider text-names-accent">{profile.kind.toLowerCase()} · development preview</p><p className="mt-3 line-clamp-2 whitespace-pre-wrap break-words text-sm text-identity-muted">{profile.bio || 'No bio added.'}</p></div><ArrowUpRight className="h-4 w-4 shrink-0 text-identity-muted"/></Link>;
}