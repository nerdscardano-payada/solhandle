import { Link } from 'react-router-dom';
export default function MarketplaceCard({ listing }) {
  return <article className="rounded-xl border border-border bg-card p-4"><p className="font-semibold">@{listing.handle}</p><p className="mt-2 text-sm text-muted-foreground">Legacy native listing · new trading is disabled.</p><Link to={`/marketplace-recovery?handle=${encodeURIComponent(listing.handle)}`} className="mt-3 block text-sm text-names-accent underline">Open cancellation & recovery</Link></article>;
}