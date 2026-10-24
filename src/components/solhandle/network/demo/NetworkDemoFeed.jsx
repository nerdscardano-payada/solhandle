import NetworkDemoPost from '@/components/solhandle/network/demo/NetworkDemoPost';
import { demoPostsFor } from '@/components/solhandle/network/demo/networkDemoData';
export default function NetworkDemoFeed({ q = '' }) {
  const posts = demoPostsFor(q);
  if (!posts.length) return null;
  return <section aria-label="Voorbeeldtijdlijn"><p className="border-b border-identity-border px-4 py-2 text-xs text-identity-muted"><span className="font-semibold text-names-accent">Demo</span> · Fictieve activiteit. Acties blijven lokaal.</p>{posts.map((post, index) => <NetworkDemoPost key={post.id} post={post} expanded={index === 0}/>)}</section>;
}