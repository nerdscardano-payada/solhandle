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
    connections: 'Your existing social connections. This connection is fictional and serves as a design example.',
    following: 'Accounts you follow in this design preview. Follows and unfollows update here immediately.',
    contacts: 'Your saved private contacts, separate from public social connections. This is a fictional address book, not real contact details.'
  };
  return <>
    <header className="sd-page-title"><div><span className="sd-eyebrow">YOUR EXISTING CONNECTIONS</span><h1>My network<span className="sd-title-dot">.</span></h1><p>Your connections, followed accounts and private contacts in one place.</p></div></header>
    <ScenarioNotice/>
    <nav className="sd-feed-tabs" aria-label="My network">{[['connections', 'Connections'], ['following', 'Following'], ['contacts', 'Private contacts']].map(([id, label]) => <button key={id} aria-pressed={tab === id} onClick={() => setTab(id)}>{label}</button>)}</nav>
    <div className="sd-directory-body">
      <label className="sd-search-field"><Search size={17}/><input aria-label="Search my network" placeholder={tab === 'contacts' ? 'Search your private contacts' : 'Search your network'} value={query} onChange={event => setQuery(event.target.value)}/></label>
      <p className="sd-directory-caption">{captions[tab]}</p>
      <PreviewPeopleList people={found} privateContacts={tab === 'contacts'} emptyTitle={query.trim() ? 'No results in your network' : tab === 'following' ? 'You are not following any accounts yet' : 'No connections yet'} emptyText={query.trim() ? 'Try another name or find new accounts in Discover.' : 'Go to Discover and follow people or projects that interest you.'}/>
    </div>
  </>;
}