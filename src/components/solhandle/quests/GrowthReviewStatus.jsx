import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useGrowthHub } from '@/components/solhandle/quests/GrowthHubProvider';
export default function GrowthReviewStatus({ review }) {
  const { refresh, busy } = useGrowthHub(), rejected = review.status === 'REJECTED';
  return <section className="rounded-2xl border border-border bg-card p-6" role="status">
    <h2 className="text-xl font-semibold">{rejected ? 'Inzending afgewezen' : 'In behandeling bij beheer'}</h2>
    <p className="mt-3 text-sm leading-7 text-muted-foreground">{rejected ? 'Voor deze inzending is geen XP toegekend. Een beheerder kan de review na bezwaar heropenen.' : 'Je bewijs is ontvangen. Er wordt pas XP toegekend na controle en goedkeuring; voer geen nieuwe betaling of mint uit om deze review te versnellen.'}</p>
    <p className="mt-3 text-xs text-muted-foreground">Ingediend: {new Date(review.submitted_at).toLocaleString('nl-NL')}{review.decided_at && ` · Besluit: ${new Date(review.decided_at).toLocaleString('nl-NL')}`}</p>
    <div className="mt-5 flex flex-wrap items-center gap-5"><Button disabled={busy} onClick={refresh}>{busy ? 'Status ophalen…' : 'Vernieuw reviewstatus'}</Button><Link to="/contact" className="text-sm text-names-accent">Contact & bezwaar →</Link></div>
  </section>;
}