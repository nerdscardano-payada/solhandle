import { useState } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import DiscoverResults from '@/components/solhandle/discover/DiscoverResults';
import { projectCategories, listingTypes } from '@/components/solhandle/network/projects/projectDirectory';
import '@/components/solhandle/discover/discover.css';
export default function EcosystemDiscover() {
  const { user } = useAuth();
  const [search,setSearch] = useState(''), [q,setQ] = useState(''), [category,setCategory] = useState('ALL'), [type,setType] = useState('ALL'), [expertise,setExpertise] = useState(''), [role,setRole] = useState('');
  const args = { q, category, type, expertise:role };
  return <main className="ep-page ep-discover space-y-6">
    <header className="ep-page-heading"><span className="ep-eyebrow">A WIDER WORLD OF SOLANA.</span><h1>Discover</h1><p>Explore Solana projects, builders and people. Curated by SolHandle, open to community suggestions.</p></header>
    <div className="discover-search-tabs"><form className="ep-search-field" role="search" onSubmit={event => { event.preventDefault(); setQ(search.trim()); }}><Search size={19}/><input aria-label="Search Discover" placeholder="Search names, projects, expertise…" value={search} onChange={event => { setSearch(event.target.value); if (!event.target.value) setQ(''); }} maxLength={80}/><button className="ep-link" type="submit">Search</button></form>
    <div className="discover-tabs" aria-label="Listing type">{Object.entries({ALL:'All',...listingTypes}).map(([value,label]) => <button key={value} type="button" aria-pressed={type === value} onClick={() => { setType(value); setCategory('ALL'); setExpertise(''); setRole(''); }}>{label}</button>)}</div></div>
    <div className="discover-filter-row">{type === 'ALL' || type === 'PROJECT' ? <label className="el-category">Category<select value={category} onChange={event => setCategory(event.target.value)}><option value="ALL">All categories</option>{Object.entries(projectCategories).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label> : <form className="ep-search-field" onSubmit={event => { event.preventDefault(); setRole(expertise.trim()); }}><input aria-label="Filter expertise or role" placeholder="Filter by expertise or role…" value={expertise} maxLength={80} onChange={event => { setExpertise(event.target.value); if (!event.target.value) setRole(''); }}/><button className="ep-link">Apply</button></form>}<div className="discover-toolbar discover-filter-actions"><Link className="ep-button ep-primary" to="/discover/submit">Submit a listing</Link>{user?.role === 'admin' && <Link className="ep-link" to="/admin/projects" aria-label="Manage directory & submissions">Manage directory</Link>}</div></div>
    <p className="ep-small">Reviewed working integrations rank first, followed by active reviewed handle links, then other listings. Alphabetical within each group. Token-based Featured is not active.</p><DiscoverResults args={args} featured/><DiscoverResults args={args}/><p className="ep-small">Directory listings are not verified identities, partnerships or endorsements. Check official sources before connecting a wallet.</p>
  </main>;
}