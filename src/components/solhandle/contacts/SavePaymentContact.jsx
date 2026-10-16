import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQueryClient } from '@tanstack/react-query';
import { BookUser } from 'lucide-react';
import { Link } from 'react-router-dom';
import useContactsAccess from '@/components/solhandle/contacts/useContactsAccess';
import ContactsAccess from '@/components/solhandle/contacts/ContactsAccess';
import ContactForm from '@/components/solhandle/contacts/ContactForm';
export default function SavePaymentContact({ payment }) {
  const { publicKey } = useWallet(), access = useContactsAccess(), client = useQueryClient();
  const [open, setOpen] = useState(false), [saved, setSaved] = useState('');
  if (publicKey?.toBase58() !== payment.sender_wallet || payment.status !== 'CONFIRMED') return null;
  return <div className="mt-5 border-t border-border pt-4 text-foreground">
    {saved ? <p role="status" className="text-sm text-names-success">{saved} <Link to="/contacts" className="underline">My Contacts</Link></p> : <>
      {!open ? <button type="button" onClick={() => setOpen(true)} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-names-accent/30 px-4 text-sm font-semibold text-names-accent"><BookUser className="h-4 w-4"/>Save recipient as contact</button> : !access.unlocked ? <ContactsAccess access={access}/> : <ContactForm key={`${access.wallet}:${payment.id}`} wallet={access.wallet} payment={payment} onCancel={() => setOpen(false)} onSaved={result => { setSaved(result.updatedExisting ? 'Existing contact updated.' : 'Recipient saved to your synced contacts.'); setOpen(false); client.invalidateQueries({ queryKey: ['wallet-contacts', access.wallet] }); }}/>} 
    </>}
  </div>;
}