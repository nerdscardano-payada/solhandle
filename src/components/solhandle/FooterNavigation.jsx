import { Link } from 'react-router-dom';
import { footerGroups } from '@/components/solhandle/navigationLinks';

export default function FooterNavigation() {
  return <div className="grid grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-5">
    {footerGroups.map(([title, links]) => <nav key={title} aria-label={title}>
      <h2 className="mb-3 text-sm font-semibold text-foreground">{title}</h2>
      <div className="space-y-1">{links.map(([label, to]) => <Link key={to} to={to} className="block py-2 text-sm text-foreground/75 hover:text-names-accent">{label}</Link>)}</div>
    </nav>)}
  </div>;
}