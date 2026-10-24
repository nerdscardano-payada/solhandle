import { useState } from 'react';
import { Search } from 'lucide-react';
import NetworkConnectionsContent from '@/components/solhandle/network/NetworkConnectionsContent';

export default function NetworkConnections() {
  const [tab, setTab] = useState('connections');
  const [query, setQuery] = useState('');
  return <><header className="sd-page-title"><div><span className="sd-eyebrow">YOUR EXISTING CONNECTIONS</span><h1>My network<span className="sd-title-dot">.</span></h1><p>Your connections, followed accounts and private contacts in one place.</p></div></header><nav className="sd-feed-tabs" aria-label="My network">{[['connections', 'Connections'], ['following', 'Following'], ['contacts', 'Private contacts']].map(([id, label]) => <button key={id} type="button" aria-pressed={tab === id} onClick={() => setTab(id)}>{label}</button>)}</nav><div className="sd-directory-body">{tab !== 'contacts' && <label className="sd-search-field"><Search size={17}/><input aria-label="Search my network" placeholder="Search your network" value={query} maxLength={80} onChange={event => setQuery(event.target.value)}/></label>}<p className="sd-directory-caption">{tab === 'contacts' ? 'Your private wallet-linked address book. Contacts are never public.' : tab === 'following' ? 'The accounts you follow.' : 'People following your account.'}</p><NetworkConnectionsContent tab={tab} query={query}/></div></>;
}