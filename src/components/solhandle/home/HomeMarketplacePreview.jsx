import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import HandleCard from '@/components/solhandle/HandleCard';
import { lamportsToSol } from '@/lib/solhandle';

export default function HomeMarketplacePreview() {
  const listings = useQuery({ queryKey: ['home-market-listings', 2], queryFn: async () => (await base44.entities.NativeListing.filter({ status: 'ACTIVE' }, { sort: '-created_date', limit: 2, fields: ['handle', 'price_lamports'] })).items, staleTime: 30000 });
  return <section className="home-content-section">
    <div className="flex items-center justify-between gap-4"><h2 className="home-section-title">Explore the marketplace</h2><Link to="/market" className="text-sm text-names-accent">View marketplace →</Link></div>
    <p className="mb-5 text-sm text-foreground/70">Already owned, now offered for sale. Buying a listed name is different from minting an available one.</p>
    {listings.isPending ? <p role="status" className="text-sm text-foreground/60">Loading listings…</p> : listings.isError ? <p className="text-sm text-foreground/60">Listings could not be loaded. <button onClick={() => listings.refetch()} className="text-names-accent underline">Retry</button></p> : !listings.data?.length ? <p className="text-sm text-foreground/60">No active listings to show right now.</p> : <div className="grid grid-cols-2 gap-4">{listings.data.map(item => <Link key={item.id} to={`/market?handle=${encodeURIComponent(item.handle)}`} className="home-name-tile home-market-tile"><div className="home-tile-artwork"><HandleCard handle={item.handle}/></div><div className="min-w-0"><span className="text-xs text-names-secondary">For sale</span><h3 className="mt-2 truncate text-2xl font-bold">@{item.handle}</h3><b className="mt-2 block text-sm text-names-secondary">{lamportsToSol(item.price_lamports)} SOL</b><span className="mt-3 block text-xs text-names-accent">View listing →</span></div></Link>)}</div>}
  </section>;
}