import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import AdminOperationsNavigation from '@/components/solhandle/admin/AdminOperationsNavigation';
import AdminMetrics from '@/components/solhandle/AdminMetrics';
import AdminMintTable from '@/components/solhandle/AdminMintTable';
import AdminTradeOverview from '@/components/solhandle/AdminTradeOverview';
import AdminClaimRequests from '@/components/solhandle/AdminClaimRequests';
import AdminClaimPolicies from '@/components/solhandle/AdminClaimPolicies';
import DiscordPublisher from '@/components/solhandle/DiscordPublisher';
import AdminTokenLaunchSettings from '@/components/solhandle/AdminTokenLaunchSettings';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import '@/components/solhandle/admin/ecosystem-admin.css';

export default function Admin() {
  const { user, isLoadingAuth, navigateToLogin } = useAuth();
  const [data, setData] = useState(null), [loading, setLoading] = useState(false);
  const loadDashboard = () => {
    setLoading(true);
    base44.functions.invoke('getAdminDashboard', {}).then(res => setData(res.data)).finally(() => setLoading(false));
  };
  useEffect(() => { if (user?.role === 'admin') loadDashboard(); }, [user?.role]);
  if (isLoadingAuth) return <main className="ep-page el-admin"><p role="status">Loading administration…</p></main>;
  if (!user) return <main className="ep-page el-admin"><section className="ep-card ep-system-state"><h1>Developer dashboard</h1><p>Sign in with your developer account to continue.</p><button onClick={navigateToLogin} className="ep-button ep-primary">Sign in</button></section></main>;
  if (user.role !== 'admin') return <main className="ep-page el-admin"><section className="ep-card ep-system-state"><h1>Access restricted</h1><p>This dashboard is available to protocol administrators only.</p></section></main>;
  return <main className="ep-page el-admin">
    <header className="ep-page-heading el-admin-heading"><div><span className="ep-eyebrow">PROTOCOL OPERATIONS</span><h1>Developer dashboard</h1><p>Treasury, income and on-chain claims for SolHandle.</p></div><button onClick={loadDashboard} disabled={loading} className="ep-button"><RefreshCw size={17} className={loading ? 'animate-spin' : ''}/>Refresh</button></header>
    <AdminOperationsNavigation/>
    <div className="el-admin-content"><AdminTokenLaunchSettings/>{data ? <><AdminMetrics data={data}/><AdminTradeOverview userId={user.id}/><DiscordPublisher/><AdminClaimPolicies/><AdminClaimRequests/><AdminMintTable mints={data.recentMints}/><p className="ep-small mt-4">Indexer last synced: {data.lastSync ? new Date(data.lastSync).toLocaleString() : 'Not available'}</p></> : <div className="ep-card mt-8" role="status">Loading protocol data…</div>}</div>
  </main>;
}