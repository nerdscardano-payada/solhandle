import { useInfiniteQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { networkPreview } from '@/components/solhandle/network/networkClient';
import NetworkState from '@/components/solhandle/network/NetworkState';
import PreviewProfileForm from '@/components/solhandle/network/preview/PreviewProfileForm';
import PreviewPostForm from '@/components/solhandle/network/preview/PreviewPostForm';
import PreviewPosts from '@/components/solhandle/network/preview/PreviewPosts';
import '@/components/solhandle/network/network.css';
export default function AdminNetworkPreview() {
  const { user } = useAuth();
  const query = useInfiniteQuery({ queryKey: ['network-preview', user?.id], initialPageParam: undefined, enabled: user?.role === 'admin', queryFn: ({ pageParam }) => networkPreview({ action: 'load', cursor: pageParam }), getNextPageParam: page => page.posts.has_more ? page.posts.next_cursor : undefined, retry: 1 });
  if (user?.role !== 'admin') return <p className="p-8">Operator access required.</p>;
  const profile = query.data?.pages[0]?.profile;
  return <main className="network-surface min-h-screen bg-hero-canvas px-5 py-8 text-identity-text"><div className="mx-auto max-w-3xl space-y-6"><Link to="/network" className="text-sm text-names-accent">← Public Network</Link><header><p className="text-xs uppercase tracking-widest text-names-secondary">Internal operator workspace</p><h1 className="mt-3 text-3xl font-semibold">Network preview publishing</h1><p className="mt-4 text-sm leading-relaxed text-identity-muted">Build and populate the public reading experience without pretending wallet login is complete. This is separate from member registration; only your own explicit preview publications are managed here.</p></header><NetworkState query={query}><PreviewProfileForm key={profile?.updated_date || 'new'} profile={profile}/><PreviewPostForm enabled={profile?.status === 'PUBLISHED'}/><PreviewPosts query={query}/></NetworkState><Link to="/admin/network-safety" className="block text-sm text-names-secondary">Domain Safety Center →</Link></div></main>;
}