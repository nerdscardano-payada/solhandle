import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
export default function NetworkDevelopmentAccess() {
  const { user } = useAuth();
  if (user?.role !== 'admin') return null;
  return <section className="space-y-3 border-b border-names-warning/30 bg-names-warning/5 p-5"><h2 className="text-sm font-semibold text-names-warning">Administrator development access</h2><p className="text-sm text-identity-muted">Profiles, posts, follows, feeds and notifications are being developed against the master specification. Exercise the working social features with isolated test accounts, without enabling public participation.</p><Link to="/network/lab" className="inline-flex rounded-full border border-names-warning/40 px-5 py-2 text-sm text-names-warning">Open social development</Link></section>;
}