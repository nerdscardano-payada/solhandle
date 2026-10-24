import NetworkDemoPost from '@/components/solhandle/network/demo/NetworkDemoPost';
import { demoPostsFor } from '@/components/solhandle/network/demo/networkDemoData';
export default function NetworkDemoFeed({ q = '' }) {
  const posts = demoPostsFor(q);
  if (!posts.length) return null;
  return <section aria-label="Voorbeeldtijdlijn"><div className="border-b border-identity-border px-5 py-3"><h2 className="text-sm font-semibold text-identity-text">Een kijkje in je netwerk <span className="ml-1 text-xs font-normal text-names-accent">Demo</span></h2><p className="mt-1 text-xs leading-relaxed text-identity-muted">Fictieve accounts, posts, reacties en aantallen. Probeer profielen, likes en reacties uit; acties blijven lokaal en verdwijnen bij herladen.</p></div>{posts.map((post, index) => <NetworkDemoPost key={post.id} post={post} expanded={index === 0}/>)}</section>;
}