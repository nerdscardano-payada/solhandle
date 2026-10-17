import { useState } from 'react';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import { useNavigate } from 'react-router-dom';
import { LockKeyhole, Plus, RefreshCw, Search } from 'lucide-react';
import usePullToRefresh from '@/hooks/usePullToRefresh';
import PullRefreshStatus from '@/components/solhandle/PullRefreshStatus';
import ContactsAccess from '@/components/solhandle/contacts/ContactsAccess';
import ContactForm from '@/components/solhandle/contacts/ContactForm';
import ContactsList from '@/components/solhandle/contacts/ContactsList';
import useContacts from '@/components/solhandle/contacts/useContacts';
import useContactSearch from '@/components/solhandle/contacts/useContactSearch';
import { contactMessage, contactRequest } from '@/components/solhandle/contacts/contactClient';
export default function ContactsWorkspace() {
  const { language } = useLanguage();
  const navigate = useNavigate(), search = useContactSearch(), data = useContacts(search.term);
  const [editing, setEditing] = useState(null), [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), [notice, setNotice] = useState('');
  const pull = usePullToRefresh(() => data.query.refetch(), !!data.unlocked && !busy);
  const remove = async id => {
    setBusy(true); setError(''); setNotice('');
    try { await contactRequest('delete', data.wallet, { id }); await data.refresh(); setNotice('Contact removed from your synced address book.'); }
    catch (e) { setError(contactMessage(e)); } finally { setBusy(false); }
  };
  const close = () => { setAdding(false); setEditing(null); };
  return <section ref={pull.ref} data-mobile-scroll-panel className="mx-auto max-w-3xl px-5 py-8 md:py-14">
    <PullRefreshStatus refreshing={pull.refreshing} distance={pull.distance} ready={pull.ready}/>
    <p className="text-sm text-names-accent">SolHandle Pay</p><h1 className="mt-2 text-3xl font-semibold">My Contacts</h1>
    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">The same address book on mobile and web, privately linked to your wallet. Saved wallet addresses never follow a handle to a new owner.</p>
    <div className="mt-6">{!data.unlocked ? <ContactsAccess access={data}/> : <div className="space-y-5">
      <div className="rounded-xl border border-border bg-card p-4"><p className="break-all font-mono text-xs text-muted-foreground">{data.wallet}</p><div className="mt-3 flex flex-wrap items-center justify-between gap-2"><p role="status" className="text-xs text-names-accent">{data.query.isFetching ? 'Synchronizing…' : data.query.isError ? 'Synchronization failed' : `Synced ${data.query.dataUpdatedAt ? new Date(data.query.dataUpdatedAt).toLocaleTimeString(language) : ''}`}</p><button type="button" disabled={data.busy} onClick={data.lock} className="inline-flex min-h-11 items-center gap-2 text-xs text-muted-foreground"><LockKeyhole className="h-4 w-4"/>Lock this device</button></div><p className="text-xs text-muted-foreground">Access until {new Date(data.session.expires_at).toLocaleDateString(language)}. Updates refresh automatically while open.</p></div>
      <div className="flex flex-wrap gap-2"><button type="button" onClick={() => { close(); setAdding(true); setNotice(''); }} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-names-accent px-4 font-semibold text-hero-canvas"><Plus className="h-4 w-4"/>Add contact</button><button type="button" onClick={() => data.query.refetch()} disabled={data.query.isFetching} aria-label="Refresh contacts" className="flex h-12 w-12 items-center justify-center rounded-xl border border-border text-names-accent disabled:opacity-50"><RefreshCw className="h-4 w-4"/></button></div>
      {(adding || editing) && <ContactForm key={editing?.id || 'new'} wallet={data.wallet} contact={editing} onCancel={close} onSaved={async result => { close(); setNotice(result.updatedExisting ? 'Existing contact updated. The saved wallet is unchanged.' : 'Contact saved and synchronized.'); await data.refresh(); }}/>}
      <label className="flex items-center gap-3 rounded-xl border border-border bg-card px-4"><Search className="h-4 w-4 shrink-0 text-muted-foreground"/><input aria-label="Search contacts" value={search.search} maxLength={80} onChange={e => search.setSearch(e.target.value)} placeholder="Search name or @handle" className="min-w-0 flex-1 bg-transparent py-3 text-foreground outline-none"/></label>
      {(error || data.error || data.query.error) && <div role="alert" className="rounded-xl border border-names-warning/30 p-4 text-sm text-names-warning">{error || data.error || contactMessage(data.query.error)}<button type="button" onClick={() => data.query.refetch()} className="ml-2 underline">Retry sync</button></div>}
      {notice && <p role="status" className="text-sm text-names-success">{notice}</p>}
      {data.query.isPending ? <p role="status" className="py-8 text-center text-muted-foreground">Loading private contacts…</p> : !data.contacts.length && !data.query.isError ? <p className="rounded-2xl border border-border p-6 text-center text-sm text-muted-foreground">{search.term ? 'No contacts match this search.' : 'No contacts yet. Add an @handle or save a recipient after a payment.'}</p> : <ContactsList contacts={data.contacts} busy={busy} onDelete={remove} onEdit={contact => { setAdding(false); setEditing(contact); }} onSend={contact => navigate('/pay', { state: { contact, contactOwnerWallet: data.wallet } })}/>}
      {data.query.hasNextPage && <button type="button" disabled={data.query.isFetchingNextPage} onClick={() => data.query.fetchNextPage()} className="min-h-12 w-full rounded-xl border border-border text-sm">{data.query.isFetchingNextPage ? 'Loading…' : 'Load more contacts'}</button>}
    </div>}</div>
  </section>;
}