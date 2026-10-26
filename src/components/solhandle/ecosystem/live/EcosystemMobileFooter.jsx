import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import AdminEcosystemLinks from '@/components/solhandle/admin/AdminEcosystemLinks';
import '@/components/solhandle/ecosystem/live/ecosystem-mobile-footer.css';

const groups = [
  ['Developers', [['Developers', '/developers'], ['Integrations', '/integrations'], ['Demo Lab', '/demos'], ['Integration Onboarding', '/integrate']]],
  ['About', [['About SolHandle', '/about'], ['Documentation', '/docs'], ['Roadmap', '/roadmap'], ['FAQ', '/faq'], ['Contact', '/contact']]],
  ['Privacy & Legal', [['Privacy', '/privacy'], ['Legal', '/legal']]],
  ['Explore', [['Browse names', '/names'], ['Profiles', '/profiles']]],
];

export default function EcosystemMobileFooter() {
  return <nav className="el-mobile-footer" aria-label="SolHandle information">
    {groups.map(([title, links]) => <details key={title} className="el-footer-group">
      <summary>{title}<ChevronDown size={16} aria-hidden="true"/></summary>
      <div className="el-footer-group-links">{links.map(([label, to]) => <Link key={to} to={to} onClick={event => event.currentTarget.closest('details').removeAttribute('open')}>{label}</Link>)}</div>
    </details>)}
    <AdminEcosystemLinks inline/>
  </nav>;
}