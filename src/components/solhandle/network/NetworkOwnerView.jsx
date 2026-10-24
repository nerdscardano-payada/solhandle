import { Link, useSearchParams } from 'react-router-dom';
import { useNetworkSession } from '@/components/solhandle/network/NetworkSessionProvider';
import NetworkWorkspace from '@/components/solhandle/network/NetworkWorkspace';
import NetworkSectionHeader from '@/components/solhandle/network/NetworkSectionHeader';
export default function NetworkOwnerView({ view = 'latest', search = '' }) {
  const session = useNetworkSession();
  const [params] = useSearchParams();
  const selected = view === 'latest' ? params.get('view') || view : view;
  const title = { profile: 'Profiel', people: 'Ontdekken', notifications: 'Meldingen', bookmarks: 'Bewaard', reposts: 'Reposts' }[selected] || 'Home';
  const visibleActorId = session.actorId || '';
  return <><NetworkSectionHeader title={title} posting={title === 'Home'}/>{!session.ready && selected !== 'profile' && <div className="border-b border-identity-border px-5 py-3 text-xs text-identity-muted"><Link to="/network/me#account" className="font-semibold text-names-accent">Activeer je handle om mee te doen.</Link></div>}{session.bootstrap.isError && <div role="alert" className="p-4 text-sm text-names-warning">Je profiel kon niet worden geladen. <button type="button" onClick={() => session.bootstrap.refetch()} className="underline">Opnieuw proberen</button></div>}{session.bootstrap.isPending ? <><p role="status" className="p-8 text-center text-sm text-identity-muted">Je Network laden…</p></> : <NetworkWorkspace key={`${session.contextKey}:${visibleActorId}:${view}:${search}`} actorId={visibleActorId} initialView={view} initialSearch={search} lockedView={view !== 'latest'}/>}</>;
}