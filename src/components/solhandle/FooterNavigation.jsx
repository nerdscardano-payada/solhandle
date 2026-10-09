import { Link } from 'react-router-dom';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import { ChevronDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { footerGroups } from '@/components/solhandle/navigationLinks';

export default function FooterNavigation() {
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  return <div className="grid grid-cols-1 gap-x-5 gap-y-2 lg:grid-cols-5 lg:gap-y-8">
    {footerGroups.map(([title, links]) => {
      const content = <div className="space-y-1 sm:space-y-0">{links.map(([label, to]) => <Link key={to} to={to} className="block py-2 sm:py-1 text-sm text-foreground/75 hover:text-names-accent">{t(label)}</Link>)}</div>;
      return <nav key={t(title)} aria-label={t(title)}>{isMobile ? <details className="group border-b border-foreground/10">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">{t(title)}<ChevronDown className="h-4 w-4 shrink-0 group-open:rotate-180" aria-hidden="true"/></summary>
        <div className="pb-3">{content}</div>
      </details> : <><h2 className="mb-3 text-sm font-semibold text-foreground">{t(title)}</h2>{content}</>}</nav>;
    })}
  </div>;
}