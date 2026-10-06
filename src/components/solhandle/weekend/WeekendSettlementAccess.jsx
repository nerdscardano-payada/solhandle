import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import WeekendAdmin from '@/components/solhandle/weekend/WeekendAdmin';

export default function WeekendSettlementAccess({ data, refresh }) {
  const { user, isLoadingAuth } = useAuth();
  if (isLoadingAuth) return <p role="status">Checking payout access…</p>;
  if (user?.role === 'admin') return <WeekendAdmin data={data} refresh={refresh}/>;
  return <section className="rounded-2xl border border-border bg-card p-5"><h2 className="text-xl font-semibold">Campaign reward payments</h2><p className="mt-2 text-sm text-muted-foreground">Reward payments require an administrator account and a connected funding wallet. Connecting a wallet alone does not sign you in as an administrator.</p>{!user ? <Link to="/login?returnTo=%2Fmint-weekend" className="mt-4 inline-flex rounded-lg bg-names-accent px-4 py-3 text-sm font-semibold text-background">Sign in as administrator to pay rewards</Link> : <p className="mt-3 text-sm text-muted-foreground">This account does not have administrator access.</p>}</section>;
}