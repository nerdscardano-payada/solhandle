import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/solhandle/Header';
import BurnActivityForm from '@/components/solhandle/BurnActivityForm';
import BurnActivityList from '@/components/solhandle/BurnActivityList';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

export default function AdminBurn() {
  const { user, isLoadingAuth, navigateToLogin } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setRecords(await base44.entities.BurnActivity.list('-block_time', 200)); }
    catch (e) { setError(e.message || 'Unable to load activity.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { if (user?.role === 'admin') load(); }, [user?.role, load]);
  if (isLoadingAuth) return <main className="min-h-screen bg-slate-950"/>;
  if (!user || user.role !== 'admin') return <main className="min-h-screen bg-slate-950 text-white"><div className="mx-auto max-w-7xl"><Header/><div className="px-5 py-20 text-center">{user ? 'Access restricted.' : <button onClick={navigateToLogin} className="rounded-lg bg-cyan-300 px-5 py-3 text-slate-950">Sign in to continue</button>}</div></div></main>;
  return <main className="min-h-screen bg-slate-950 text-white"><div className="mx-auto min-h-screen max-w-7xl border-x border-white/10"><Header/><section className="px-5 py-12 md:px-9"><Link to="/admin" className="text-sm text-cyan-300">← Developer dashboard</Link><h1 className="mt-3 text-4xl font-semibold">Burn</h1><p className="mt-3 text-sm text-slate-400">Record each buyback and burn after it confirms on Solana. Saving a record never sends or signs a transaction.</p><BurnActivityForm onSaved={load}/>{error && <p role="alert" className="mt-5 text-rose-300">{error}</p>}<BurnActivityList records={records} loading={loading}/></section></div></main>;
}