import { ArrowUpRight } from 'lucide-react';
import { communityLinks } from '@/components/solhandle/navigationLinks';

export default function CommunityLinks({ onNavigate }) {
  return <nav aria-label="SolHandle community" className="flex flex-wrap gap-3">
    {communityLinks.map(([label, href]) => <a key={href} href={href} target="_blank" rel="noopener noreferrer" onClick={onNavigate} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-names-accent/25 bg-names-accent/5 px-3 py-2 text-sm text-names-accent hover:border-names-accent/60">{label}<ArrowUpRight className="h-4 w-4" aria-hidden="true"/></a>)}
  </nav>;
}