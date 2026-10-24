import { useState } from 'react';
import { Search } from 'lucide-react';
import { useDesign } from '@/components/solhandle/design/DesignContext';
import PreviewPeopleList from '@/components/solhandle/design/PreviewPeopleList';
import { previewPeople } from '@/components/solhandle/design/previewPeople';

export default function DiscoverDirectory() {
  const d = useDesign();
  const [tab, setTab] = useState('people');
  const [query, setQuery] = useState(d.search);
  const found = previewPeople.filter(person => (tab === 'projects' ? person.kind === 'PROJECT' : person.kind === 'PERSON') && `${person.name} ${person.handle}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <>
    <header className="sd-page-title"><div><span className="sd-eyebrow">NEW NAMES, NEW IDEAS</span><h1>Discover<span className="sd-title-dot">.</span></h1><p>Find new people, creators and projects on Solana.</p></div></header>
    <nav className="sd-feed-tabs" aria-label="Discover">{[['people', 'People & creators'], ['projects', 'Projects']].map(([id, label]) => <button key={id} aria-pressed={tab === id} onClick={() => setTab(id)}>{label}</button>)}</nav>
    <div className="sd-directory-body">
      <label className="sd-search-field"><Search size={17}/><input aria-label="Search people and projects" placeholder={tab === 'projects' ? 'Search for a project or @handle' : 'Search for a person or @handle'} value={query} onChange={event => setQuery(event.target.value)}/></label>
      <p className="sd-directory-caption">Suggested examples to discover. Follow an account to find it in My network. Not verified partners.</p>
      <PreviewPeopleList people={found} emptyTitle="No results" emptyText="Try another name or browse the other category."/>
    </div>
  </>;
}