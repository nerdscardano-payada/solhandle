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
    <header className="sd-page-title"><div><span className="sd-eyebrow">NIEUWE NAMEN, NIEUWE IDEEËN</span><h1>Ontdekken<span className="sd-title-dot">.</span></h1><p>Vind nieuwe mensen, creators en projecten op Solana.</p></div></header>
    <nav className="sd-feed-tabs" aria-label="Ontdekken">{[['people', 'Mensen & creators'], ['projects', 'Projecten']].map(([id, label]) => <button key={id} aria-pressed={tab === id} onClick={() => setTab(id)}>{label}</button>)}</nav>
    <div className="sd-directory-body">
      <label className="sd-search-field"><Search size={17}/><input aria-label="Zoek mensen en projecten" placeholder={tab === 'projects' ? 'Zoek een project of @handle' : 'Zoek een persoon of @handle'} value={query} onChange={event => setQuery(event.target.value)}/></label>
      <p className="sd-directory-caption">Aanbevolen voorbeelden om te ontdekken. Volg een account om het in Mijn netwerk terug te vinden. Geen geverifieerde partners.</p>
      <PreviewPeopleList people={found} emptyTitle="Geen resultaten" emptyText="Probeer een andere naam of bekijk de andere categorie."/>
    </div>
  </>;
}