import { Link } from 'react-router-dom';
import AdminEcosystemLinks from '@/components/solhandle/admin/AdminEcosystemLinks';
const links = [['Profiles', '/profiles'], ['About', '/about'], ['Browse names', '/names'], ['Developers', '/developers'], ['Integrations', '/integrations'], ['Documentation', '/docs'], ['Demo Lab', '/demos'], ['Integration Onboarding', '/integrate'], ['Roadmap', '/roadmap'], ['FAQ', '/faq'], ['Contact', '/contact'], ['Privacy', '/privacy'], ['Legal', '/legal']];
export default function EcosystemLiveFooter() {
  return <footer className="el-footer"><Link to="/" className="el-footer-brand">SolHandle<span>ONE IDENTITY. ONE ECOSYSTEM.</span></Link><nav aria-label="SolHandle information">{links.map(([label, to]) => <Link key={to} to={to}>{label}</Link>)}<AdminEcosystemLinks inline/></nav><p>Owned on Solana. Controlled by you. No custody. No internal balance.</p></footer>;
}