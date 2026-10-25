import { BookOpen, FlaskConical, Plug, Map } from 'lucide-react';
import { NavLink } from 'react-router-dom';
const links = [[BookOpen, 'Documentation', '/docs'], [FlaskConical, 'Demo Lab', '/demos'], [Plug, 'Integration Onboarding', '/integrate'], [Map, 'Roadmap', '/roadmap']];
export default function EcosystemResourceNavigation() {
  return <section className="el-resource-navigation"><p className="ep-eyebrow">BUILD & EXPLORE</p><nav aria-label="Build and explore">{links.map(([Icon, label, to]) => <NavLink key={to} to={to}><Icon size={18}/><span>{label}</span></NavLink>)}</nav></section>;
}