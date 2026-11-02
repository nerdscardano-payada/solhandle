import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import '@/components/solhandle/ecosystem/live/ecosystem-navigation.css';
const links = [['Claim Handle', '/search'], ['Explore', '/discover'], ['Ecosystem', '/ecosystem'], ['Developers', '/developers'], ['$HANDLE', '/upcoming/token-launch']];
export default function PublicNavigation({ mobile = false }) {
  if (mobile) return <details className="public-mobile-menu"><summary aria-label="Open public navigation"><Menu size={21}/></summary><nav aria-label="Mobile public navigation">{links.map(([label, to]) => <Link key={to} to={to} onClick={event => event.currentTarget.closest('details').removeAttribute('open')}>{label}</Link>)}</nav></details>;
  return <nav className="el-home-navigation" aria-label="Homepage navigation">{links.map(([label, to]) => <Link key={to} to={to}>{label}</Link>)}</nav>;
}