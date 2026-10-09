import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import growthHubClient, { growthError } from '@/components/solhandle/quests/growthHubClient';
import GrowthAdminReviewCard from '@/components/solhandle/quests/GrowthAdminReviewCard';
import { Button } from '@/components/ui/button';
export default function GrowthAdminReviews({ busy, onAction }) {
  const [status, setStatus] = useState('PENDING');
  const query = useInfiniteQuery({ queryKey:['growth-hub-reviews',status], initialPageParam:null, queryFn:({pageParam}) => growthHubClient({scope:'admin',action:'review_queue',status,cursor:pageParam}), getNextPageParam:page => page.has_more ? page.next_cursor : undefined });
  return <section className="mt-9">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-4"><h2 className="text-xl font-semibold">Quest-fraudereview</h2><div className="flex gap-3"><select aria-label="Reviewstatus" value={status} onChange={e => setStatus(e.target.value)} className="rounded-xl border border-input bg-card px-3 py-2"><option value="PENDING">In behandeling</option><option value="APPROVED">Goedgekeurd</option><option value="REJECTED">Afgewezen</option><option value="ALL">Alle reviews</option></select><Button variant="outline" disabled={query.isFetching} onClick={() => query.refetch()}>Vernieuwen</Button></div></div>
    <p className="mb-5 text-sm leading-7 text-muted-foreground">Alle referralbewijzen en overige inzendingen met open fraudeflags vereisen een gemotiveerd besluit. Goedkeuren verifieert het bewijs opnieuw en kent uitsluitend pilot-XP toe. Blokkeringen moeten eerst worden opgelost; bestaande Share & Earn-besluiten en betalingen worden niet gewijzigd.</p>
    {query.isPending ? <p>Reviews laden…</p> : query.isError ? <p role="alert">{growthError(query.error)}</p> : <><div className="space-y-4">{query.data.pages.flatMap(page => page.items).map(row => <GrowthAdminReviewCard key={`${row.id}:${row.updated_date}`} review={row} busy={busy} onAction={onAction}/>)}</div>{query.data.pages[0].items.length === 0 && <p className="rounded-xl border border-border p-5 text-muted-foreground">Geen reviews met deze status.</p>}{query.hasNextPage && <Button variant="outline" className="mt-4" disabled={query.isFetchingNextPage} onClick={() => query.fetchNextPage()}>{query.isFetchingNextPage ? 'Laden…' : 'Meer reviews laden'}</Button>}</>}
  </section>;
}