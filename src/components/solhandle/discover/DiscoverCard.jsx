import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import DiscoverListingImages from '@/components/solhandle/discover/DiscoverListingImages';
import { projectCategories, listingTypes } from '@/components/solhandle/network/projects/projectDirectory';
export default function DiscoverCard({ listing }) {
  const type = listing.listing_type || 'PROJECT';
  return <article className="ep-card discover-card"><DiscoverListingImages listing={listing}/><div className="discover-meta"><span>{listingTypes[type]}</span>{listing.featured && <span>Featured selection</span>}</div><h3>{listing.name}</h3><p className="discover-muted">{listing.summary}</p><small className="discover-muted">{type === 'PROJECT' ? `${projectCategories[listing.category] || 'Other'}${listing.product_status ? ` · ${listing.product_status.toLowerCase()}` : ''}` : listing.expertise || 'Solana ecosystem'}</small>{listing.handle && <small>{listing.handle} · ownership not verified here</small>}<Link className="ep-button" to={`/discover/projects/${listing.id}`}>View {type === 'PROJECT' ? 'project' : 'profile'}<ArrowUpRight size={15}/></Link></article>;
}