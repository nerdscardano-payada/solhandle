import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import useProjectPages from '@/components/solhandle/network/projects/useProjectPages';
import { projectCategories } from '@/components/solhandle/network/projects/projectDirectory';
import ProjectCard from '@/components/solhandle/network/projects/ProjectCard';
import NetworkState from '@/components/solhandle/network/NetworkState';
import NetworkMore from '@/components/solhandle/network/NetworkMore';

export default function NetworkProjectDirectory({ q = '' }) {
  const { user } = useAuth();
  const [category, setCategory] = useState('ALL');
  const query = useProjectPages({ q, category });
  const projects = query.data?.pages.flatMap(page => page.items) || [];
  return <section className="social-section space-y-4" aria-label="Project directory">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2>Projects</h2>{user?.role === 'admin' && <Link to="/admin/projects" className="text-sm text-names-accent underline">Manage projects</Link>}</div>
    <p className="text-sm text-identity-muted">Published by SolHandle administrators. A directory listing is not an official verification, partnership or endorsement.</p>
    <label className="flex flex-wrap items-center gap-3 text-sm text-foreground">Category<select value={category} onChange={event => setCategory(event.target.value)} className="min-h-11 max-w-full rounded-lg border border-border bg-card px-3"><option value="ALL">All categories</option>{Object.entries(projectCategories).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    <NetworkState query={query} empty={!projects.length && 'No published projects match this search.'}><div className="grid min-w-0 gap-4 sm:grid-cols-2">{projects.map(project => <ProjectCard key={project.id} project={project}/>)}</div><NetworkMore query={query}/></NetworkState>
  </section>;
}