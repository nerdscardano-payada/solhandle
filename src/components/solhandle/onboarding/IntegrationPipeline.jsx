import { Button } from '@/components/ui/button';
import useIntegrationPipeline from '@/components/solhandle/onboarding/useIntegrationPipeline';
import IntegrationPipelineMetrics from '@/components/solhandle/onboarding/IntegrationPipelineMetrics';
import IntegrationPipelineFilters from '@/components/solhandle/onboarding/IntegrationPipelineFilters';
import IntegrationSubmissionRows from '@/components/solhandle/onboarding/IntegrationSubmissionRows';
import IntegrationSubmissionDetail from '@/components/solhandle/onboarding/IntegrationSubmissionDetail';
export default function IntegrationPipeline() {
  const flow = useIntegrationPipeline();
  return <><div className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="font-heading text-3xl font-semibold">Integration Pipeline</h1><p className="mt-2 text-sm text-muted-foreground">Private requests and community suggestions. All-time totals; no invented activity.</p></div><Button variant="outline" className="min-h-12" disabled={flow.busy} onClick={() => flow.load()}>Refresh</Button></div><IntegrationPipelineMetrics page={flow.page}/><IntegrationPipelineFilters filters={flow.filters} onChange={flow.setFilters}/>{flow.error && <p role="alert" className="mt-5 text-sm text-destructive">{flow.error}</p>}{flow.busy && flow.page && <p role="status" className="mt-4 text-sm text-muted-foreground">Updating…</p>}{flow.detail ? <IntegrationSubmissionDetail key={flow.detail.record.id} flow={flow}/> : <IntegrationSubmissionRows flow={flow}/>}</>;
}