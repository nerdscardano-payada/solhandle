import { ArrowUpRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { communityLinks } from '@/components/solhandle/navigationLinks';

export default function CommunityLinks({ onNavigate, iconsOnly = false }) {
  return <nav aria-label="SolHandle community" className="flex flex-wrap gap-3">
    {communityLinks.map(([label, href]) => <a key={href} href={href} target="_blank" rel="noopener noreferrer" onClick={onNavigate} aria-label={label} title={label} className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg border border-names-accent/25 bg-names-accent/5 px-3 py-2 text-sm text-names-accent hover:border-names-accent/60">{iconsOnly ? <Image src={`https://cdn.simpleicons.org/${href.includes('x.com') ? 'x' : 'discord'}/67e8f9`} alt="" className="h-5 w-5"/> : <>{label}<ArrowUpRight className="h-4 w-4" aria-hidden="true"/></>}</a>)}
  </nav>;
}