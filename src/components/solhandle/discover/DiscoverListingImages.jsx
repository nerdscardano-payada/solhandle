import { Image } from '@/components/ui/image';
export default function DiscoverListingImages({ listing, showHandle = false }) {
  if (!listing.banner_url && !listing.pfp_url && !(showHandle && listing.handle)) return null;
  const avatar = listing.pfp_url && <Image src={listing.pfp_url} alt={`${listing.name} profile picture`} className="discover-pfp"/>;
  return <div className="discover-listing-images">{listing.banner_url && <Image src={listing.banner_url} alt={`${listing.name} banner`} className="discover-banner"/>}{showHandle ? <div className="discover-avatar-row">{avatar}{listing.handle && <small className="discover-avatar-handle">{listing.handle}</small>}</div> : avatar}</div>;
}