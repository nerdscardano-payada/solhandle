import { Link } from 'react-router-dom';
import { ArrowUpRight, ContactRound, Send } from 'lucide-react';
import useContacts from '@/components/solhandle/contacts/useContacts';
import ContactsAccess from '@/components/solhandle/contacts/ContactsAccess';
import ContactAvatar from '@/components/solhandle/contacts/ContactAvatar';
import { contactMessage } from '@/components/solhandle/contacts/contactClient';

export default function EcosystemLiveContacts() {
  const data = useContacts();
  return <section className="ep-card">
    <div className="ep-card-heading"><h2><ContactRound size={19}/>Your Contacts</h2><Link to="/contacts" className="ep-link">View all <ArrowUpRight size={15}/></Link></div>
    {!data.unlocked ? <ContactsAccess access={data}/> : <div className="space-y-3">
      {data.query.isPending && <p role="status" className="ep-small">Loading private contacts…</p>}
      {data.query.isError && <div role="alert" className="text-sm text-names-warning">{contactMessage(data.query.error)} <button type="button" className="underline" onClick={() => data.query.refetch()}>Retry</button></div>}
      {!data.query.isPending && !data.query.isError && !data.contacts.length && <p className="ep-small">No contacts yet. Save a contact from a public profile or add one in <Link to="/contacts" className="ep-link">My Contacts</Link>.</p>}
      {data.contacts.map(contact => <div key={contact.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
        <ContactAvatar contact={contact}/>
        <div className="min-w-0 flex-1"><span data-no-translate className="block truncate font-semibold">{contact.name}</span><span data-no-translate className="block truncate text-sm text-names-accent">{contact.handle}</span></div>
        <Link to="/pay" state={{ contact, contactOwnerWallet: data.wallet }} aria-label={`Send to ${contact.name}`} className="ep-button shrink-0"><Send size={15}/>Send</Link>
      </div>)}
      {data.query.hasNextPage && <button type="button" className="ep-link" disabled={data.query.isFetchingNextPage} onClick={() => data.query.fetchNextPage()}>{data.query.isFetchingNextPage ? 'Loading…' : 'Load more contacts'}</button>}
      <p className="ep-small">Payments use the saved wallet, even if a handle changes owner.</p>
    </div>}
  </section>;
}