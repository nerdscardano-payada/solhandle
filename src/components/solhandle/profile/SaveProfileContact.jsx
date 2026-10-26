import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { BookUser } from 'lucide-react';
import useContactsAccess from '@/components/solhandle/contacts/useContactsAccess';
import ContactsAccess from '@/components/solhandle/contacts/ContactsAccess';
import ContactForm from '@/components/solhandle/contacts/ContactForm';

export default function SaveProfileContact({ handle, inlineAction = null }) {
  const access = useContactsAccess(), client = useQueryClient();
  const [open, setOpen] = useState(false), [saved, setSaved] = useState(null);
  const savedHere = saved?.wallet === access.wallet && saved?.handle === handle;
  return <div className="mt-auto space-y-3 pt-5">
    {savedHere ? <p role="status" className="text-sm text-names-success">{saved.message} <Link to="/contacts" className="underline">My Contacts</Link></p> : <>
      <div className={inlineAction ? 'flex flex-wrap items-center gap-3' : ''}><button type="button" className={inlineAction ? 'ep-button' : 'ep-button ml-auto flex w-fit'} aria-expanded={open} onClick={() => setOpen(value => !value)}><BookUser className="h-4 w-4"/>{open ? 'Cancel' : inlineAction ? 'Save Contact' : 'Save as contact'}</button>{inlineAction}</div>
      {open && (!access.unlocked ? <ContactsAccess access={access}/> : <ContactForm key={`${access.wallet}:${handle}`} wallet={access.wallet} initialHandle={handle} onCancel={() => setOpen(false)} onSaved={result => {
        setSaved({ wallet: access.wallet, handle, message: result.updatedExisting ? 'Existing contact updated.' : 'Contact saved to My Contacts.' });
        setOpen(false);
        client.invalidateQueries({ queryKey: ['wallet-contacts', access.wallet] });
      }}/>)}
    </>}
    {savedHere && inlineAction}
  </div>;
}