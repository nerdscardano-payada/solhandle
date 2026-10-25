import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import useProjectPages from '@/components/solhandle/network/projects/useProjectPages';
import ProjectAdminRow from '@/components/solhandle/network/projects/ProjectAdminRow';
import ProjectForm from '@/components/solhandle/network/projects/ProjectForm';
import NetworkState from '@/components/solhandle/network/NetworkState';
import NetworkMore from '@/components/solhandle/network/NetworkMore';

export default function ProjectAdminWorkspace() {
  const client = useQueryClient();
  const [q, setQ] = useState(''), [status, setStatus] = useState('ALL'), [editing, setEditing] = useState(undefined), [message, setMessage] = useState('');
  const query = useProjectPages({ admin: true, q, status });
  const projects = query.data?.pages.flatMap(page => page.items) || [];
  const mutation = useMutation({ mutationFn: data => editing?.id ? base44.entities.NetworkProject.update(editing.id, data) : base44.entities.NetworkProject.create(data) });
  const save = async data => {
    await mutation.mutateAsync(data);
    await Promise.all([client.invalidateQueries({ queryKey: ['network-projects'] }), client.invalidateQueries({ queryKey: ['network-project'] })]);
    setEditing(undefined); setMessage(data.status === 'PUBLISHED' ? 'Project saved and published in Discover.' : 'Draft saved. This project is hidden from visitors.');
  };
  return <section className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6" lang="en" translate="no">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-3xl font-bold">Project management</h1><p className="mt-2 text-sm text-muted-foreground">Create, edit, publish or withdraw directory listings. No automatic verification badge.</p></div><Link to="/network/discover" className="text-sm text-names-accent underline">Open Discover</Link></div>
    {message && <p role="status" className="rounded-lg border border-names-accent/30 p-3 text-sm text-names-accent">{message}</p>}
    {editing !== undefined ? <ProjectForm key={editing?.id || 'new'} project={editing} onSave={save} onCancel={() => setEditing(undefined)}/> : <button type="button" onClick={() => { setMessage(''); setEditing(null); }} className="min-h-11 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground">Add project</button>}
    <div className="flex flex-wrap gap-3"><label className="min-w-0 flex-1 text-sm">Search projects<input value={q} onChange={event => setQ(event.target.value)} maxLength={80} className="mt-2 min-h-11 w-full rounded-lg border border-border bg-card px-3" placeholder="Name or summary"/></label><label className="text-sm">Visibility<select value={status} onChange={event => setStatus(event.target.value)} className="mt-2 block min-h-11 rounded-lg border border-border bg-card px-3"><option value="ALL">All projects</option><option value="DRAFT">Drafts</option><option value="PUBLISHED">Published</option></select></label></div>
    <NetworkState query={query} empty={!projects.length && 'No projects found. Add a project or change your search.'}><div className="grid gap-4 sm:grid-cols-2">{projects.map(project => <ProjectAdminRow key={project.id} project={project} onEdit={row => { setMessage(''); setEditing(row); }} disabled={editing !== undefined || mutation.isPending}/>)}</div><NetworkMore query={query}/></NetworkState>
  </section>;
}