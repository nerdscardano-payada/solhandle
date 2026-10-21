import { Link } from 'react-router-dom';
export default function MarketplaceAction({ action, handle }) {
  const cancellation = action === 'delist' || action === 'cancel_bid';
  return <Link to={`/marketplace-recovery${handle ? `?handle=${encodeURIComponent(handle)}` : ''}`} className="block rounded-lg border border-border px-4 py-2 text-sm text-names-accent">{cancellation ? 'Open cancellation & recovery' : 'Native trading retired · Recovery'}</Link>;
}