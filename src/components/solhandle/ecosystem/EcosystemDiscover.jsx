import { Search, ArrowUpRight, Fingerprint, Plus, UserRound } from 'lucide-react';
import { useEcosystem } from '@/components/solhandle/ecosystem/EcosystemContext';
import { demoPeople, demoProjects } from '@/components/solhandle/ecosystem/previewData';
import EcosystemProjects from '@/components/solhandle/ecosystem/EcosystemProjects';
export default function EcosystemDiscover() {
  const d = useEcosystem(), q = d.search.trim().toLowerCase().replace(/^@/, '');
  const projects = demoProjects.filter(item => `${item.name} ${item.category} ${item.description}`.toLowerCase().includes(q));
  const people = demoPeople.filter(item => `${item.handle} ${item.name} ${item.bio}`.toLowerCase().includes(q));
  const handles = ['@ansem', '@solbuilder', '@myidentity'].filter(handle => handle.includes(q));
  return <div className="ep-page ep-discover"><header className="ep-page-heading"><p className="ep-eyebrow">EXPLORE YOUR ECOSYSTEM</p><h1>Discover</h1><p>Find names, meet people, explore what is being built.</p></header>
    <label className="ep-search-field"><Search size={19}/><input aria-label="Search example handles, people or projects" autoComplete="off" maxLength={80} value={d.search} onChange={event => d.setSearch(event.target.value)} placeholder="Search handles, people or Solana projects..."/></label>
    <div className="ep-tabs" aria-label="Search categories">{['All', 'Projects', 'People', 'Handles'].map(category => <button key={category} onClick={() => d.setCategory(category)} aria-pressed={d.category === category}>{category}</button>)}</div>
    <p className="ep-small">Demo search across local examples only. Not a live global resolver.</p>
    {['All', 'Projects'].includes(d.category) && <EcosystemProjects projects={projects}/>}
    {['All', 'People'].includes(d.category) && <section className="ep-card"><h2><UserRound size={19}/>People <span className="ep-demo-pill">DEMO</span></h2>{people.length ? <div className="ep-people-grid">{people.map(person => <article key={person.handle} className="ep-person"><span className="ep-contact-avatar">{person.initials}</span><h3>{person.handle}</h3><p>{person.bio}</p><button className="ep-button" onClick={() => d.setModal({ type: 'person', person })}>View example profile <ArrowUpRight size={14}/></button><button className="ep-link" disabled={d.contacts.some(item => item.handle === person.handle)} onClick={() => d.saveContact(person)}><Plus size={14}/>{d.contacts.some(item => item.handle === person.handle) ? 'Saved privately' : 'Save contact'}</button></article>)}</div> : <div className="ep-empty">No people match this search.</div>}</section>}
    {['All', 'Handles'].includes(d.category) && <section className="ep-card"><h2><Fingerprint size={19}/>Handles <span className="ep-demo-pill">DEMO</span></h2>{handles.length ? handles.map(handle => <div className="ep-handle-row" key={handle}><div><strong>{handle}</strong><p>Example NFT identity · not an ownership check</p></div><button className="ep-button" onClick={() => d.setModal({ type: 'handle', handle })}>View identity</button></div>) : <div className="ep-empty">No example handles match. No live availability has been checked.</div>}</section>}
  </div>;
}