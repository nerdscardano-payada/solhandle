import { Link } from 'react-router-dom';
export default function MarketplaceNotificationItems() {
  return <div className="text-sm text-muted-foreground"><p>Native trading is retired. Historical notifications do not prove a bid is still funded.</p><Link to="/marketplace-recovery" className="mt-3 block text-names-accent underline">Check live listings and bids · Marketplace Recovery</Link></div>;
}