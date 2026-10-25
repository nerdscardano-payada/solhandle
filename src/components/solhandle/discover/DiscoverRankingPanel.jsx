import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { projectError } from '@/components/solhandle/network/projects/projectDirectory';
import { rankingBenefits } from '@/components/solhandle/discover/discoverRanking';
import DiscoverRankingReviewForm from '@/components/solhandle/discover/DiscoverRankingReviewForm';

export default function DiscoverRankingPanel({ id }) {
  const client = useQueryClient();
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), [message, setMessage] = useState('');
  const query = useQuery({ queryKey: ['discover-ranking', id], queryFn: () => base44.entities.NetworkProject.get(id) });
  const run = async data => {
    setBusy(true); setError(''); setMessage('');
    try {
      const response = await base44.functions.invoke('discoverRanking', { ...data, id });
      setMessage(response.data.message || 'Ranking review saved.');
      await Promise.all(['discover-ranking', 'network-projects', 'network-project'].map(key => client.invalidateQueries({ queryKey: [key] })));
      return true;
    } catch (failure) { setError(projectError(failure)); return false; }
    finally { setBusy(false); }
  };
  if (query.isPending) return <p role="status">Loading ranking reviews…</p>;
  if (query.isError) return <div role="alert">Ranking reviews could not load. <button type="button" onClick={() => query.refetch()}>Retry</button></div>;
  const listing = query.data, benefits = rankingBenefits(listing);
  return <section className="space-y-4 rounded-xl border border-border bg-card p-5 text-foreground">
    <h3 className="text-lg font-semibold">Ranking review: {listing.name}</h3>
    <p className="text-sm text-muted-foreground">Integration first, active linked handle second, then other listings. Alphabetical within each group. No token-based Featured. Only publish public evidence links.</p>
    {['integration', 'handle'].map(kind => <div key={kind} className="space-y-3">
      <p className="text-sm">{kind === 'handle' ? 'Handle' : 'Integration'} benefit: {benefits[kind] ? 'Active' : 'Not active'}{listing[`${kind}_valid_until`] && ` · review expires ${new Date(listing[`${kind}_valid_until`]).toLocaleString()}`}</p>
      {kind === 'handle' && listing.handle_check_status && <p className="text-xs">Ownership: {listing.handle_check_status}{listing.handle_checked_at && ` · last successful check ${new Date(listing.handle_checked_at).toLocaleString()}`}</p>}
      <DiscoverRankingReviewForm kind={kind} listing={listing} run={run} busy={busy}/>
      <div className="flex flex-wrap gap-3"><button type="button" className="ep-button" disabled={busy} onClick={() => run({ action: `revoke_${kind}` })}>Remove {kind} benefit only</button>{kind === 'handle' && benefits.handle && <button type="button" className="ep-button" disabled={busy} onClick={() => run({ action: 'recheck' })}>Recheck ownership now</button>}</div>
    </div>)}
    <p className="text-xs text-muted-foreground">Expired reviews stop boosting immediately. A transfer removes only the handle benefit, never the listing, handle text or NFT. Integration eligibility is independent. These reviews do not grant an Official Project badge.</p>
    {error && <p role="alert" className="text-destructive">{error}</p>}{message && <p role="status">{message}</p>}
  </section>;
}