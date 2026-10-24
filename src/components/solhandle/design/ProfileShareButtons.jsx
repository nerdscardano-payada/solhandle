import ProfileShareActions from '@/components/solhandle/profile/ProfileShareActions';

export default function ProfileShareButtons({ handle }) {
  if (!handle) return null;
  const url = `https://solhandle.io/@${encodeURIComponent(handle.replace(/^@/, ''))}`;
  return <ProfileShareActions url={url} text={`Discover ${handle} on SolHandle.`} label={handle}/>;
}