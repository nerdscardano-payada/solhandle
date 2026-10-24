import NetworkDemoProfile from '@/components/solhandle/network/demo/NetworkDemoProfile';
import { demoProfileById } from '@/components/solhandle/network/demo/networkDemoData';
export default function NetworkDemoReplies({ replies, id }) {
  return <div id={id} className="mt-3 space-y-4 border-t border-identity-border pt-4">{replies.map((reply, index) => <div key={`${reply.author}:${index}`} className="border-l-2 border-identity-border pl-3"><NetworkDemoProfile compact profile={demoProfileById(reply.author)}/><p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-identity-text">{reply.body}</p><span className="mt-1 block text-xs text-identity-muted">Voorbeeldreactie</span></div>)}</div>;
}