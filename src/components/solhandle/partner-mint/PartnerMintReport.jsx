import { Button } from '@/components/ui/button';
import usePartnerMintReport from '@/components/solhandle/partner-mint/usePartnerMintReport';
import PartnerMintReportStats from '@/components/solhandle/partner-mint/PartnerMintReportStats';
import PartnerMintReportRows from '@/components/solhandle/partner-mint/PartnerMintReportRows';
import { pilotMessage } from '@/components/solhandle/partner-mint/partnerPilotClient';
import PartnerMintDirectRecovery from '@/components/solhandle/partner-mint/PartnerMintDirectRecovery';
export default function PartnerMintReport({ partnerId, refreshKey }) {
  const { query, recovery, receipts, totals, checkedAt } = usePartnerMintReport(partnerId, refreshKey);
  const busy = query.isFetching || recovery.isPending;
  return <section className="mt-8 rounded-xl border border-names-secondary/30 bg-card p-5">
    <p className="text-xs font-semibold uppercase tracking-wider text-names-warning">Devnet only · admin reporting</p>
    <h2 className="mt-2 font-heading text-xl">Verified partner mint activity</h2>
    <p className="mt-2 text-sm text-muted-foreground">Partner: {partnerId}. Only chain-verified finalized receipts count. Network fees and account costs are excluded. Devnet totals are test activity, not production revenue.</p>
    <div className="mt-4 flex flex-wrap gap-3"><Button variant="outline" disabled={busy} onClick={() => query.refetch()}>Refresh report</Button><Button variant="outline" disabled={busy} onClick={() => recovery.mutate()}>{recovery.data?.hasMore ? 'Recover next batch' : 'Recover saved mints'}</Button></div>
    {busy && <p className="mt-3 text-sm text-muted-foreground" role="status">{recovery.isPending ? 'Rechecking up to five saved mints on Devnet…' : 'Loading verified receipts…'}</p>}
    {(query.error || recovery.error) && <p role="alert" className="mt-3 text-sm text-destructive">{pilotMessage(query.error || recovery.error)}</p>}
    {recovery.data && <div className="mt-3 text-sm" role="status">{recovery.data.results.length ? recovery.data.results.map(result => <p key={result.handle}>@{result.handle}: {result.status}{result.error ? ` (${result.error}). Retry recovery before treating this as settled.` : ''}</p>) : <p>No saved mints require recovery for this administrator.</p>}</div>}
    <PartnerMintDirectRecovery partnerId={partnerId} />
    {totals && <><PartnerMintReportStats totals={totals} /><p className="mt-3 text-xs text-muted-foreground">Observed searches: {totals.events?.SEARCH || 0} · Available searches: {totals.events?.AVAILABLE_SEARCH || 0} · Quotes: {totals.events?.QUOTE || 0} · Prepared intents: {totals.events?.PREPARED || 0} · Submitted intents: {totals.events?.SUBMITTED || 0}. Search counts are requests, not unique people; telemetry starts when enabled and is not revenue evidence.</p></>}
    {!query.isPending && !query.error && <PartnerMintReportRows receipts={receipts} />}
    {query.hasNextPage && <Button className="mt-4" variant="outline" disabled={busy} onClick={() => query.fetchNextPage()}>Load more receipts</Button>}
    {checkedAt && <p className="mt-4 text-xs text-muted-foreground">Report checked: {new Date(checkedAt).toLocaleString()}. Saved-intent recovery rechecks this administrator's pilot mints; signature recovery also supports directly broadcast Partner Mints.</p>}
  </section>;
}