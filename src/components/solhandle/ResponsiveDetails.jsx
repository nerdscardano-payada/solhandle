import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function ResponsiveDetails({ label, children }) {
  const [open, setOpen] = useState(() => window.matchMedia('(min-width:1280px)').matches);
  useEffect(() => {
    const media = window.matchMedia('(min-width:1280px)');
    const update = event => setOpen(event.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return <details className="responsive-app-details min-w-0" open={open} onToggle={event => setOpen(event.currentTarget.open)}>
    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3 text-sm text-names-accent lg:hidden">{label}<ChevronDown className={`h-4 w-4 ${open ? 'rotate-180' : ''}`} aria-hidden="true"/></summary>
    {children}
  </details>;
}