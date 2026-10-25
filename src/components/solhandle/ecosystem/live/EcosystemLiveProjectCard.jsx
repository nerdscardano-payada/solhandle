import { Link } from 'react-router-dom';
import { ArrowUpRight, Layers3 } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { ecosystemAssets } from '@/components/solhandle/ecosystem/live/ecosystemRoutes';
import { projectCategories } from '@/components/solhandle/network/projects/projectDirectory';
export default function EcosystemLiveProjectCard({ project }) {
  return <article className="ep-project"><div className="ep-project-art"><Image src={project.banner_url || ecosystemAssets.city} alt={project.banner_url ? `${project.name} banner` : ''} className="ep-cover-image"/>{project.pfp_url ? <Image src={project.pfp_url} alt={`${project.name} profile picture`} className="ep-project-mark discover-project-pfp"/> : <span className="ep-project-mark" aria-label="Project initial, not an official logo">{project.name.slice(0, 1)}</span>}</div><div className="ep-project-content"><h3>{project.name}</h3><span className="ep-listing"><Layers3 size={12}/>Directory listing</span><p>{project.summary}</p><small>{projectCategories[project.category] || 'Other'}</small><Link to={`/discover/projects/${encodeURIComponent(project.id)}`} className="ep-button ep-project-button">View Project <ArrowUpRight size={14}/></Link></div></article>;
}