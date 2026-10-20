import { Button } from '@/components/ui/button';
import IntakeStart from '@/components/solhandle/onboarding/IntakeStart';
import IntegrationWizardForm from '@/components/solhandle/onboarding/IntegrationWizardForm';
import IntegrationResult from '@/components/solhandle/onboarding/IntegrationResult';
import useIntegrationIntake from '@/components/solhandle/onboarding/useIntegrationIntake';
export default function IntegrationIntake() {
  const flow = useIntegrationIntake();
  if (!flow.config) return <div className="py-12 text-center">{flow.error ? <><p role="alert" className="text-destructive">{flow.error}</p><Button className="mt-5 min-h-12" onClick={flow.load}>Try again</Button></> : <p role="status" className="text-muted-foreground">Preparing your integration path…</p>}</div>;
  if (flow.result) return <IntegrationResult flow={flow}/>;
  if (flow.type) return <IntegrationWizardForm flow={flow}/>;
  return <><IntakeStart onStart={flow.start}/>{sessionStorage.getItem('solhandle-integration-receipt') && <div className="text-center"><Button variant="outline" className="min-h-12" onClick={flow.restore} disabled={flow.busy}>{flow.busy ? 'Opening…' : 'Open my last submission receipt'}</Button>{flow.error && <p role="alert" className="mt-3 text-sm text-destructive">{flow.error}</p>}</div>}</>;
}