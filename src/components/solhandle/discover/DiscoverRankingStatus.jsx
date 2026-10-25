import { rankingBenefits } from '@/components/solhandle/discover/discoverRanking';

export default function DiscoverRankingStatus({ listing }) {
  const benefits = rankingBenefits(listing);
  if (!benefits.integration && !benefits.handle) return null;
  return <p className="ep-small">{benefits.integration ? 'Working SolHandle integration reviewed' : 'Active handle link reviewed'}{benefits.handle && listing.handle_check_status === 'UNCERTAIN' ? ' · ownership recheck temporarily unavailable' : ''}</p>;
}