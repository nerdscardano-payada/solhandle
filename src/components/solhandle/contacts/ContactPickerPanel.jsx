import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ContactsAccess from '@/components/solhandle/contacts/ContactsAccess';
import useContacts from '@/components/solhandle/contacts/useContacts';
import useContactSearch from '@/components/solhandle/contacts/useContactSearch';
import { contactMessage } from '@/components/solhandle/contacts/contactClient';
export default function ContactPickerPanel({ onSelect }) {
  const search = useContactSearch(), data = useContacts(search.term);
  return <div className="mt-3 space-y-3 rounded-xl border border-names-accent/25 bg-card p-4 text-foreground">
    {!data.unlocked ? <ContactsAccess access={data}/> : <>
      <input aria-label="Search saved contacts" value={search.search} maxLength={80} onChange={e => search.setSearch(e.target.value)} placeholder="Search name or @handle" className="w-full rounded-lg border border-border bg-background px-3 py-3 outline-none focus:border-names-accent"/>
      {data.query.isPending && <p role="status" className="text-sm text-muted-foreground">Loading contacts…</p>}
      {data.query.isError && <p role="alert" className="text-sm text-names-warning">{contactMessage(data.query.error)} <button type="button" onClick={() => data.query.refetch()} className="underline">Retry</button></p>}
      {!data.query.isPending && !data.query.isError && !data.contacts.length && <p className="text-sm text-muted-foreground">{search.term ? 'No matching contacts.' : 'No saved contacts yet.'}</p>}
      <div className="max-h-72 overflow-y-auto overscroll-contain">{data.contacts.map(contact => <button key={contact.id} type="button" onClick={() => onSelect(contact)} className="flex min-h-16 w-full items-center justify-between gap-2 border-b border-border py-3 text-left"><span className="min-w-0"><span data-no-translate className="block break-words text-sm font-semibold">{contact.name}</span><span className="block text-xs text-names-accent">{contact.handle}</span><span className="block font-mono text-xs text-muted-foreground">{contact.recipient_wallet.slice(0, 8)}…{contact.recipient_wallet.slice(-6)}</span></span><ChevronRight className="h-4 w-4 shrink-0 text-names-accent"/></button>)}</div>
      {data.query.hasNextPage && <button type="button" disabled={data.query.isFetchingNextPage} onClick={() => data.query.fetchNextPage()} className="min-h-11 w-full text-sm text-names-accent">{data.query.isFetchingNextPage ? 'Loading…' : 'Load more'}</button>}
    </>}
    <Link to="/contacts" className="inline-flex min-h-11 items-center text-sm text-names-accent underline">Manage My Contacts</Link>
  </div>;
}