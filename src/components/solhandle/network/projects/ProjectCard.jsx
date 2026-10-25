import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { projectCategories } from '@/components/solhandle/network/projects/projectDirectory';

export default function ProjectCard({ project }) {
  return <article className="min-w-0 space-y-3 rounded-xl border border-identity-border bg-card p-5">
    <p className="text-xs text-identity-muted">{projectCategories[project.category] || 'Other'} · DIRECTORY LISTING</p>
    <h3 className="break-words text-lg font-semibold text-foreground" data-no-translate>{project.name}</h3>
    <p className="whitespace-pre-wrap break-words text-sm text-identity-muted">{project.summary}</p>
    <Link to={`/network/projects/${encodeURIComponent(project.id)}`} className="sd-button sd-secondary">View project <ArrowUpRight size={15}/></Link>
  </article>;
}