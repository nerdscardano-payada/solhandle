import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, RefreshCw, Flame, ChartNoAxesCombined, Plug, Trophy, FlaskConical, Landmark } from 'lucide-react';
import { growthHubVisible } from '@/components/solhandle/navigationLinks';

const links = [
  [Compass, 'Discover management', '/admin/projects'],
  [ShieldCheck, 'Network Safety', '/admin/network-safety'],
  [RefreshCw, 'Flywheel', '/flywheel'],
  [Flame, 'Burn', '/admin/burn'],
  [ChartNoAxesCombined, 'Analytics', '/admin/analytics'],
  [Plug, 'Integration Pipeline', '/admin/integrations'],
  ...(growthHubVisible ? [[Trophy, 'Growth Hub', '/admin/growth']] : []),
  [FlaskConical, 'Mainnet Tests', '/admin/mainnet-tests'],
  [Landmark, 'Financials', '/admin/financials']
];
export default function AdminOperationsNavigation() {
  return <nav className="el-admin-navigation" aria-label="Administration tools">{links.map(([Icon, label, to]) => <Link key={to} to={to} className={to === '/admin/projects' ? 'ep-button ep-primary' : 'ep-button'}><Icon size={18}/><span>{label}</span></Link>)}</nav>;
}