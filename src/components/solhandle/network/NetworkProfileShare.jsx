import { profilePath } from '@/components/solhandle/network/networkClient';
import ProfileShareActions from '@/components/solhandle/profile/ProfileShareActions';

export default function NetworkProfileShare({ profile, path }) {
  if (!profile?.id) return null;
  const url = new URL(path || profilePath(profile), window.location.origin).href;
  return <ProfileShareActions url={url} text={`${profile.name} on SolHandle`} label={profile.handle || profile.name}/>;
}