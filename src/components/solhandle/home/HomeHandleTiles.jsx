import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import invokeWithRetry from '@/lib/invokeWithRetry';

const names = ['money', 'short', 'travel', 'wallet', 'builder'];
export default function HomeHandleTiles({ compact = false }) {
  const { data, isPending, isError } = useQuery({ queryKey: ['home-live-handles'], staleTime: 30000, queryFn: async () => {
    const [availability, listings] = await Promise.all([Promise.all(names.map(handle => invokeWithRetry('getHandleAvailability', { handle }).then(({ data }) => data))), base44.entities.NativeListing.filter({ status: 'ACTIVE', handle: { $in: names } }, { limit: 5, fields: ['handle', 'price_lamports'] })]);
    return availability.map(item => ({ ...item, listing: listings.items.find(listing => listing.handle === item.handle) }));
  }});
  const select = handle => { document.getElementById('search-handles')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); window.dispatchEvent(new CustomEvent('solhandle:home-select', { detail: { handle } })); };
  if (isPending) return <div className="mt-4 h-20 animate-pulse rounded-xl bg-names-accent/5" aria-label="Loading live handle availability"/>;
  if (isError) return <p className="mt-4 text-sm text-foreground/70">Live names are temporarily unavailable. Use the search above.</p>;
  return <div className={compact ? 'home-live-list' : 'home-handle-grid'}>{data.map(item => {
    const label = item.listing ? 'For sale' : item.available ? 'Available' : item.status === 'CLAIMED' ? 'Claimed' : ['RESERVED', 'PROTECTED'].includes(item.status) ? 'Reserved' : 'Unverified';
    const content = <><span className={compact ? 'text-xl font-bold' : 'block text-3xl font-bold tracking-tight'}>@{item.handle}</span><span className={`mt-2 flex items-center gap-2 text-xs ${item.available ? 'text-names-success' : item.listing ? 'text-names-secondary' : 'text-foreground/65'}`}><span className="h-1.5 w-1.5 rounded-full bg-current"/>{label}{item.listing && ` · ${Number(item.listing.price_lamports) / 1e9} SOL`}</span></>;
    return !item.listing && item.status !== 'CLAIMED' ? <button key={item.handle} onClick={() => select(item.handle)} className="home-name-tile text-left">{content}<span className="mt-3 block text-xs text-names-accent">{item.available ? 'Mint this name →' : 'Check this name →'}</span></button> : <Link key={item.handle} to={item.listing ? `/market?handle=${encodeURIComponent(item.handle)}` : `/${item.handle}`} className="home-name-tile">{content}<span className="mt-3 block text-xs text-names-accent">{item.listing ? 'View listing →' : 'View name →'}</span></Link>;
  })}</div>;
}