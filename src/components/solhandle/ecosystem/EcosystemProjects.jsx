import { Compass, ArrowUpRight, Layers3 } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { useEcosystem } from '@/components/solhandle/ecosystem/EcosystemContext';
import { demoProjects, ecosystemAssets } from '@/components/solhandle/ecosystem/previewData';
export default function EcosystemProjects({ compact = false, projects }) {
  const d = useEcosystem();
  const entries = d.scenario === 'empty' ? [] : projects || demoProjects;
  return <section className="ep-card ep-projects"><div className="ep-card-heading"><h2><Compass size={19}/>Discover Solana Projects</h2>{compact && <button className="ep-link" onClick={() => { d.setSearch(''); d.setCategory('Projects'); d.go('discover'); }}>View all <ArrowUpRight size={14}/></button>}</div><p>Explore projects building across the Solana ecosystem.</p><p className="ep-small">DEMO LISTINGS · No partnership or official verification implied.</p>
    {entries.length ? <div className="ep-project-grid">{entries.map(project => <article className={`ep-project ep-project-${project.id}`} key={project.id}><div className="ep-project-art"><Image src={ecosystemAssets.city} alt="" className="ep-cover-image" focalPointX={project.id === 'jupiter' ? 0.15 : 0.8} focalPointY={0.5}/><span className="ep-project-mark" aria-label="Illustrative monogram, not an official project logo">{project.mark}</span><span className="ep-art-label">DEMO</span></div><div className="ep-project-content"><h3>{project.name}</h3><span className="ep-listing"><Layers3 size={12}/>Directory listing · demo</span><p>{project.description}</p><small>{project.category}</small><button className="ep-button ep-project-button" onClick={() => { d.setModal({ type: 'project', project }); }}>View Project <ArrowUpRight size={14}/></button></div></article>)}</div> : <div className="ep-empty"><Compass size={28}/><h3>No projects to show yet</h3><p>Published projects will appear here. No demo activity is presented as live data.</p></div>}
  </section>;
}