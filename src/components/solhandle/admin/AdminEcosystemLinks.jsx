import { Link, NavLink } from 'react-router-dom';
import { ShieldCheck, ListChecks } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function AdminEcosystemLinks({ inline = false }) {
  const { user } = useAuth();
  if (user?.role !== 'admin') return null;
  if (inline) return null;
  return null;
}