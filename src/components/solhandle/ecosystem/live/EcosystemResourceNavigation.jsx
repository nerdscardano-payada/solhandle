import { BookOpen, FlaskConical, Plug, Map, Code2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
const links = [[Code2, 'Developers', '/developers'], [BookOpen, 'Documentation', '/docs'], [FlaskConical, 'Demo Lab', '/demos'], [Plug, 'Integrations', '/integrations'], [Plug, 'Integration Onboarding', '/integrate'], [Map, 'Roadmap', '/roadmap']];
export default function EcosystemResourceNavigation() {
  return <section className="el-resource-navigation"><p className="ep-eyebrow">Build with SolHandle</p><nav aria-label="Build with SolHandle">{links.map(([Icon, label, to]) => <NavLink key={to} to={to}><Icon size={18}/><span>{label}</span></NavLink>)}</nav></section>;
}