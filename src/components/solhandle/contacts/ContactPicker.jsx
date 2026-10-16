import { useState } from 'react';
import { BookUser, ChevronDown } from 'lucide-react';
import ContactPickerPanel from '@/components/solhandle/contacts/ContactPickerPanel';
export default function ContactPicker({ onSelect }) {
  const [open, setOpen] = useState(false);
  return <div><button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="flex min-h-11 w-full items-center gap-2 text-sm font-semibold text-names-accent"><BookUser className="h-4 w-4"/>Choose a saved contact<ChevronDown className="ml-auto h-4 w-4"/></button>{open && <ContactPickerPanel onSelect={contact => { onSelect(contact); setOpen(false); }}/>}</div>;
}