import { Link } from 'react-router-dom';
import { Compass, ArrowUpRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import useProjectPages from '@/components/solhandle/network/projects/useProjectPages';
import EcosystemLiveProjectCard from '@/components/solhandle/ecosystem/live/EcosystemLiveProjectCard';
export default function EcosystemLiveProjects({ compact = false, q = '', category = 'ALL' }) {
  const { user } = useAuth();
  const query = useProjectPages({ q, category, type: 'PROJECT', limit: compact ? 4 : 20 });
  const projects = query.data?.pages.flatMap(page => page.items) || [];
  return <section className="ep-card ep-projects"><div className="ep-card-heading"><h2><Compass size={19}/>Discover Solana Projects</h2>{compact ? <Link className="ep-link" to="/discover">View all <ArrowUpRight size={14}/></Link> : user?.role === 'admin' && <Link className="ep-link" to="/admin/projects">Manage projects <ArrowUpRight size={14}/></Link>}</div><p>Explore projects building across the Solana ecosystem.</p><p className="ep-small">Administrator-published listings, not official verification or endorsements.</p>
    {query.isPending ? <div className="ep-empty" role="status"><Loader2 size={25} className="animate-spin"/>Loading projects…</div> : query.isError ? <div className="ep-empty" role="alert"><p>Projects could not be loaded.</p><button className="ep-button" onClick={() => query.refetch()}>Try again</button></div> : projects.length ? <div className="ep-project-grid">{projects.map(project => <EcosystemLiveProjectCard key={project.id} project={project}/>)}</div> : <div className="ep-empty"><Compass size={28}/><h3>{q || category !== 'ALL' ? 'No matching projects' : 'No published projects yet'}</h3><p>{q || category !== 'ALL' ? 'Try another search or category.' : 'Projects appear here once published by SolHandle.'}</p></div>}
    {!compact && query.hasNextPage && <button className="ep-button el-load-more" disabled={query.isFetchingNextPage} onClick={() => query.fetchNextPage()}>{query.isFetchingNextPage ? 'Loading…' : 'Load more projects'}</button>}
  </section>;
}