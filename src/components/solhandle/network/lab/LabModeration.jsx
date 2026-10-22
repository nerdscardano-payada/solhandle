import useLabList from '@/components/solhandle/network/lab/useLabList';
import NetworkState from '@/components/solhandle/network/NetworkState';
import NetworkMore from '@/components/solhandle/network/NetworkMore';
import LabReportDecision from '@/components/solhandle/network/lab/LabReportDecision';
export default function LabModeration({ actorId }) {
  const query = useLabList(actorId, { action: 'reports' });
  const rows = query.data?.pages.flatMap(page => page.items) || [];
  return <><header className="space-y-3 border-b border-identity-border p-5"><h2 className="font-semibold">Development moderation queue</h2><p className="text-sm text-identity-muted">Reports and decisions here apply only to isolated test content. Decisions require a reason and create an administrator audit record; production reports and appeal support are separate work.</p></header><NetworkState query={query} empty={!rows.length && 'No test reports yet. Report a test post to exercise moderation.'}>{rows.map(report => <LabReportDecision key={report.id} actorId={actorId} report={report}/>)}<NetworkMore query={query}/></NetworkState></>;
}