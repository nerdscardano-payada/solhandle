import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { projectCategories, projectFields } from '@/components/solhandle/network/projects/projectDirectory';
import NetworkExternalLink from '@/components/solhandle/network/NetworkExternalLink';
import NetworkState from '@/components/solhandle/network/NetworkState';

export default function NetworkProject({ backTo = '/network/discover' }) {
  const { projectId } = useParams();
  const query = useQuery({
    queryKey: ['network-project', projectId], staleTime: 0, refetchInterval: 30000, retry: 1,
    queryFn: async () => {
      if (!/^[a-f0-9]{24}$/.test(projectId || '')) return null;
      const page = await base44.entities.NetworkProject.filter({ id: projectId, status: 'PUBLISHED' }, { limit: 1, fields: projectFields });
      return page.items[0] || null;
    }
  });
  const project = query.data;
  return <section lang="en" translate="no" className="space-y-5 p-5 sm:p-6">
    <Link to={backTo} className="text-sm text-names-accent underline">Back to Discover</Link>
    <NetworkState query={query}>{project ? <article className="space-y-5">
      <p className="text-xs text-identity-muted">{projectCategories[project.category] || 'Other'} · DIRECTORY LISTING</p>
      <h1 className="break-words text-3xl font-bold text-foreground" data-no-translate>{project.name}</h1>
      <p className="whitespace-pre-wrap break-words text-lg text-foreground">{project.summary}</p>
      {project.description && <div className="whitespace-pre-wrap break-words text-sm leading-relaxed text-identity-muted">{project.description}</div>}
      <NetworkExternalLink href={project.website}>Visit project website</NetworkExternalLink>
      <p className="rounded-xl border border-identity-border p-4 text-sm text-identity-muted">This listing was published by a SolHandle administrator. It is not an Official Project verification, partnership or endorsement. Independently check the project before connecting a wallet or signing a transaction.</p>
    </article> : <div><h1 className="text-2xl font-semibold">Project not available</h1><p className="mt-3 text-sm text-identity-muted">This project has not been published or has been withdrawn.</p></div>}</NetworkState>
  </section>;
}