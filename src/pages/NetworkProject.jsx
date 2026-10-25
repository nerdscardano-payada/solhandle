import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { projectFields } from '@/components/solhandle/network/projects/projectDirectory';
import { rankingFields } from '@/components/solhandle/discover/discoverRanking';
import DiscoverDetailContent from '@/components/solhandle/discover/DiscoverDetailContent';
import '@/components/solhandle/discover/discover.css';
import NetworkState from '@/components/solhandle/network/NetworkState';

export default function NetworkProject({ backTo = '/network/discover' }) {
  const { projectId } = useParams();
  const query = useQuery({
    queryKey: ['network-project', projectId], staleTime: 0, refetchInterval: 30000, retry: 1,
    queryFn: async () => {
      if (!/^[a-f0-9]{24}$/.test(projectId || '')) return null;
      const page = await base44.entities.NetworkProject.filter({ id: projectId, status: 'PUBLISHED' }, { limit: 1, fields: [...projectFields, ...rankingFields] });
      return page.items[0] || null;
    }
  });
  const project = query.data;
  return <section lang="en" translate="no" className="space-y-5 p-5 sm:p-6">
    <Link to={backTo} className="text-sm text-names-accent underline">Back to Discover</Link>
    <NetworkState query={query}>{project ? <DiscoverDetailContent listing={project}/> : <div><h1 className="text-2xl font-semibold">Listing not available</h1><p className="mt-3 text-sm text-identity-muted">This listing has not been published or has been withdrawn.</p></div>}</NetworkState>
  </section>;
}