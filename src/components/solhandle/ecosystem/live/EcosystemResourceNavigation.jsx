import { BookOpen, Code2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
const links = [[BookOpen, 'Token check', '/token-check'], [BookOpen, 'Token Passport', '/token-passport'], [Code2, 'Developers & Integrations', '/developers'], [Code2, 'AI Integration Advisor', '/integrate/ai'], [BookOpen, 'Help / Documentation', '/docs']];
export default function EcosystemResourceNavigation() {
  return <section className="el-resource-navigation"><p className="ep-eyebrow">Resources</p><nav aria-label="Resources">{links.map(([Icon, label, to]) => <NavLink key={to} to={to}><Icon size={18}/><span>{label}</span></NavLink>)}</nav></section>;
}