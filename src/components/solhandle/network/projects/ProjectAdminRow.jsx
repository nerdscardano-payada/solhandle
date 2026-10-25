import { Link } from 'react-router-dom';
import { projectCategories } from '@/components/solhandle/network/projects/projectDirectory';

export default function ProjectAdminRow({ project, onEdit, disabled }) {
  return <article className="min-w-0 space-y-3 rounded-xl border border-border bg-card p-4">
    <div className="flex flex-wrap items-start justify-between gap-3"><h3 className="break-words font-semibold" data-no-translate>{project.name}</h3><span className="rounded-full border border-border px-3 py-1 text-xs">{project.status === 'PUBLISHED' ? 'Published' : project.status === 'HIDDEN' ? 'Hidden' : 'Draft'}</span></div>
    <p className="text-xs text-muted-foreground">{project.listing_type || 'PROJECT'} · {projectCategories[project.category]}{project.featured ? ' · Featured' : ''}</p><p className="whitespace-pre-wrap break-words text-sm text-muted-foreground">{project.summary}</p>
    <div className="flex flex-wrap gap-4"><button type="button" disabled={disabled} onClick={() => onEdit(project)} className="min-h-11 text-sm font-semibold text-names-accent underline disabled:opacity-50">Edit project</button>{project.status === 'PUBLISHED' && <Link to={`/discover/projects/${encodeURIComponent(project.id)}`} className="flex min-h-11 items-center text-sm text-names-accent underline">View public project</Link>}</div>
  </article>;
}