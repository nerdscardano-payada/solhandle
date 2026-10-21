import { Link } from 'react-router-dom';
export default function MarketplaceRetirementNotice({ handle = '' }) {
  const params = new URLSearchParams({ tab: 'for-sale', ...(handle ? { handle } : {}) });
  return <section className="rounded-xl border border-border bg-card p-4 text-sm text-foreground">
    <p className="font-semibold">Native marketplace trading on SolHandle has ended</p>
    <p className="mt-2 text-muted-foreground">New listings, purchases, bids and offer acceptance are disabled on SolHandle. Existing listings and bids can still be cancelled by their authorized wallet.</p>
    <p className="mt-2 text-muted-foreground">The on-chain program has not been disabled. Existing listings can still be purchased directly until their owners cancel them through Marketplace Recovery.</p>
    <div className="mt-3 flex flex-wrap gap-4"><Link to={`/marketplace-recovery${handle ? `?handle=${encodeURIComponent(handle)}` : ''}`} className="font-medium text-names-accent underline">Marketplace Recovery</Link><Link to={`/names?${params}`} className="text-names-accent underline">Discover names</Link></div>
  </section>;
}