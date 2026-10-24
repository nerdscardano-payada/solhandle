import useLabList from '@/components/solhandle/network/lab/useLabList';
import useNetworkSocialMutation from '@/components/solhandle/network/lab/useNetworkSocialMutation';
import { labError } from '@/components/solhandle/network/lab/labClient';
import NetworkState from '@/components/solhandle/network/NetworkState';
import NetworkMore from '@/components/solhandle/network/NetworkMore';
export default function LabNotifications({ actorId, onProfile, onConversation }) {
  const query = useLabList(actorId, { action: 'notifications' });
  const read = useNetworkSocialMutation(actorId);
  const rows = query.data?.pages.flatMap(page => page.items) || [];
  return <><h2 className="border-b border-identity-border p-5 font-semibold">Notifications · {query.isSuccess ? query.data?.pages[0]?.unread ?? '—' : '—'} unread</h2><NetworkState query={query} empty={!rows.length && 'No notifications yet. New activity appears here.'}>{rows.map(row => <article key={row.id} aria-label={row.read ? 'Read notification' : 'Unread notification'} className="space-y-3 border-b border-identity-border p-5"><button onClick={() => onProfile(row.actor.id)} className="font-semibold text-names-accent">{row.actor.name}</button><p className="text-sm text-identity-muted">{row.message || row.kind.toLowerCase()} {row.read ? '· read' : '· unread'}</p><div className="flex gap-5 text-sm">{row.postId && <button onClick={() => onConversation(row.postId)} className="text-names-secondary">Open conversation</button>}{!row.read && <button disabled={read.isPending} onClick={() => read.mutate({ action: 'notificationRead', id: row.id })} className="text-names-accent">Mark read</button>}</div></article>)}<NetworkMore query={query}/></NetworkState>{read.isError && <p role="alert" className="p-5 text-sm text-names-warning">{labError(read.error)}</p>}</>;
}