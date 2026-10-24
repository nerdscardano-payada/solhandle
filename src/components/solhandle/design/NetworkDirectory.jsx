import { useState } from 'react';
import { Search } from 'lucide-react';
import { useDesign } from '@/components/solhandle/design/DesignContext';
import ScenarioNotice from '@/components/solhandle/design/ScenarioNotice';
import PreviewPeopleList from '@/components/solhandle/design/PreviewPeopleList';
import { previewPeople, previewConnections, previewContacts } from '@/components/solhandle/design/previewPeople';

export default function NetworkDirectory() {
  const d = useDesign();
  const [tab, setTab] = useState('connections');
  const [query, setQuery] = useState('');
  const found = previewPeople.filter(person => (tab === 'following' ? d.isFollowing(person.handle) : (tab === 'contacts' ? previewContacts : previewConnections).includes(person.handle)) && `${person.name} ${person.handle}`.toLowerCase().includes(query.trim().toLowerCase()));
  const captions = {
    connections: 'Je bestaande sociale verbindingen. Deze connectie is fictief en dient als ontwerpvoorbeeld.',
    following: 'Accounts die je in dit ontwerpvoorbeeld volgt. Volgen en ontvolgen worden direct hier bijgewerkt.',
    contacts: 'Je opgeslagen privécontacten, los van openbare sociale connecties. Dit is een fictief adresboek, geen echte contactgegevens.'
  };
  return <>
    <header className="sd-page-title"><div><span className="sd-eyebrow">JOUW BESTAANDE VERBINDINGEN</span><h1>Mijn netwerk<span className="sd-title-dot">.</span></h1><p>Je connecties, gevolgde accounts en privécontacten op één plek.</p></div></header>
    <ScenarioNotice/>
    <nav className="sd-feed-tabs" aria-label="Mijn netwerk">{[['connections', 'Connecties'], ['following', 'Volgend'], ['contacts', 'Privécontacten']].map(([id, label]) => <button key={id} aria-pressed={tab === id} onClick={() => setTab(id)}>{label}</button>)}</nav>
    <div className="sd-directory-body">
      <label className="sd-search-field"><Search size={17}/><input aria-label="Zoek binnen mijn netwerk" placeholder={tab === 'contacts' ? 'Zoek in je privécontacten' : 'Zoek binnen je netwerk'} value={query} onChange={event => setQuery(event.target.value)}/></label>
      <p className="sd-directory-caption">{captions[tab]}</p>
      <PreviewPeopleList people={found} privateContacts={tab === 'contacts'} emptyTitle={query.trim() ? 'Geen resultaten in je netwerk' : tab === 'following' ? 'Je volgt nog geen accounts' : 'Nog geen verbindingen'} emptyText={query.trim() ? 'Probeer een andere naam of zoek nieuwe accounts via Ontdekken.' : 'Ga naar Ontdekken en volg mensen of projecten die je interessant vindt.'}/>
    </div>
  </>;
}