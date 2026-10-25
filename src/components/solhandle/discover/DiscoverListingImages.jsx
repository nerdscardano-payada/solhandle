import { Image } from '@/components/ui/image';
export default function DiscoverListingImages({ listing }) {
  if (!listing.banner_url && !listing.pfp_url) return null;
  return <div className="discover-listing-images">{listing.banner_url && <Image src={listing.banner_url} alt={`${listing.name} banner`} className="discover-banner"/>}{listing.pfp_url && <Image src={listing.pfp_url} alt={`${listing.name} profile picture`} className="discover-pfp"/>}</div>;
}