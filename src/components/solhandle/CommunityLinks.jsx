import { ArrowUpRight, Linkedin } from 'lucide-react';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import { Image } from '@/components/ui/image';
import { communityLinks } from '@/components/solhandle/navigationLinks';

export default function CommunityLinks({ onNavigate, iconsOnly = false, includeLinkedIn = false }) {
  const { t } = useLanguage();
  const links = includeLinkedIn ? [...communityLinks, ['LinkedIn', 'https://www.linkedin.com/in/solhandle']] : communityLinks;
  return <nav aria-label="SolHandle community" className="flex flex-wrap gap-3">
    {links.map(([label, href]) => <a key={href} href={href} target="_blank" rel="noopener noreferrer" onClick={onNavigate} aria-label={t(label)} title={t(label)} className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg border border-names-accent/25 bg-names-accent/5 px-3 py-2 text-sm text-names-accent hover:border-names-accent/60">{iconsOnly ? (href.includes('linkedin.com') ? <Linkedin className="h-5 w-5" aria-hidden="true"/> : <Image src={`https://cdn.simpleicons.org/${href.includes('x.com') ? 'x' : 'discord'}/67e8f9`} alt="" className="h-5 w-5"/>) : <>{t(label)}<ArrowUpRight className="h-4 w-4" aria-hidden="true"/></>}</a>)}
  </nav>;
}