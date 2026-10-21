import { Link } from 'react-router-dom';
export default function PortfolioMarketplaceAction({ item }) {
  return <Link to={`/marketplace-recovery?handle=${encodeURIComponent(item.handle)}`} className="block rounded-lg border border-border px-4 py-2 text-sm text-names-accent">Manage legacy listing / bid</Link>;
}