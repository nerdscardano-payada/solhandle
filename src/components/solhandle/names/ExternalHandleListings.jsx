import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ArrowUpRight } from 'lucide-react';
export default function ExternalHandleListings({ handle, asset }) {
  const query = useQuery({ queryKey: ['external-handle-listing', handle, asset], enabled: !!handle && !!asset, retry: false, staleTime: 60000,
    queryFn: async () => { const { data } = await base44.functions.invoke('discoverNames', { tab: 'for-sale', search: handle }); if (data.error) throw new Error(data.error); return data.items.find(item => item.handle === handle && item.asset === asset)?.externalListing || null; }
  });
  if (query.isPending) return <p role="status" className="ep-small">Checking external offers…</p>;
  if (query.isError) return <p className="ep-small">External offers could not be checked. <button className="ep-link" onClick={() => query.refetch()}>Retry</button></p>;
  const listing = query.data;
  if (!listing) return <p className="ep-small">No recently verified external offer was found for @{handle}. The marketplace link above opens the NFT, not a confirmed sale.</p>;
  return <section className="ep-card"><h2>On sale · external marketplace</h2><p className="mt-3">{listing.price} {listing.currency}</p><a className="ep-link mt-3 inline-flex min-h-11 items-center gap-2" href={listing.url} target="_blank" rel="noopener noreferrer">View on {listing.marketplace}<ArrowUpRight size={16}/></a><p className="ep-small mt-3">Source checked {new Date(listing.checkedAt).toLocaleString()}. Availability and purchase are confirmed on the external marketplace. SolHandle does not process the purchase.</p></section>;
}