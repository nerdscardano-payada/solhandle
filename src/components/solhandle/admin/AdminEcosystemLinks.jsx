import { Link, NavLink } from 'react-router-dom';
import { ShieldCheck, ListChecks } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function AdminEcosystemLinks({ inline = false }) {
  const { user } = useAuth();
  if (user?.role !== 'admin') return null;
  if (inline) return null;
  return <div className="el-resource-navigation hidden"><p className="ep-eyebrow">ADMINISTRATION</p><nav aria-label="Administrator navigation"><NavLink to="/admin" end><ShieldCheck size={18} /><span>Admin overview</span></NavLink><NavLink to="/admin/projects"><ListChecks size={18} /><span>Discover management</span></NavLink></nav></div>;
}