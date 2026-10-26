import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import DiscoverListingImages from '@/components/solhandle/discover/DiscoverListingImages';
import DiscoverRankingStatus from '@/components/solhandle/discover/DiscoverRankingStatus';
import { projectCategories, listingTypes } from '@/components/solhandle/network/projects/projectDirectory';
export default function DiscoverCard({ listing }) {
  const type = listing.listing_type || 'PROJECT';
  return <article className="ep-card discover-card"><DiscoverListingImages listing={listing} showHandle/><div className="discover-meta"><span>{listingTypes[type]}</span>{listing.featured && <span>Featured selection</span>}</div><h3>{listing.name}</h3><p className="discover-muted">{listing.summary}</p><small className="discover-muted">{type === 'PROJECT' ? `${projectCategories[listing.category] || 'Other'}${listing.product_status ? ` · ${listing.product_status.toLowerCase()}` : ''}` : listing.expertise || 'Solana ecosystem'}</small><DiscoverRankingStatus listing={listing}/><Link className="ep-button" to={`/discover/projects/${listing.id}`}>View {type === 'PROJECT' ? 'project' : 'profile'}<ArrowUpRight size={15}/></Link></article>;
}