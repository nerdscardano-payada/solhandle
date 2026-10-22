import useLabList from '@/components/solhandle/network/lab/useLabList';
import NetworkState from '@/components/solhandle/network/NetworkState';
import NetworkMore from '@/components/solhandle/network/NetworkMore';
export default function LabModerationHistory({ actorId, reportId }) {
  const query = useLabList(actorId, { action: 'moderationHistory', reportId });
  const rows = query.data?.pages.flatMap(page => page.items) || [];
  return <details className="text-xs text-identity-muted"><summary className="cursor-pointer">Decision history</summary><NetworkState query={query} empty={!rows.length && 'No decisions recorded.'}>{rows.map(row => <div key={row.id} className="mt-3 rounded-xl border border-identity-border p-3"><p className="font-semibold text-names-secondary">{row.action} · {new Date(row.date).toLocaleString()}</p><p className="mt-2 whitespace-pre-wrap">{row.reason}</p></div>)}<NetworkMore query={query}/></NetworkState></details>;
}