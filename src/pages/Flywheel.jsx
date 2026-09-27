import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import Header from '@/components/solhandle/Header';
import FlywheelDashboard from '@/components/solhandle/FlywheelDashboard';
import { useAuth } from '@/lib/AuthContext';

export default function Flywheel() {
  const { user, isLoadingAuth, navigateToLogin } = useAuth();
  const [progress, setProgress] = useState(null);
  useEffect(() => {
    if (user?.role !== 'admin') return;
    let active = true;
    const load = () => base44.functions.invoke('growthCurve', { action: 'view' }).then(res => { if (active) setProgress(res.data?.cycle?.max_progress ?? null); }).catch(() => { if (active) setProgress(null); });
    load();
    const timer = setInterval(load, 60000);
    return () => { active = false; clearInterval(timer); };
  }, [user?.role]);
  if (isLoadingAuth) return <main className="min-h-screen bg-slate-950" />;
  if (!user) return <main className="min-h-screen bg-slate-950 text-white"><div className="mx-auto max-w-7xl"><Header/><section className="px-5 py-20 text-center"><h1 className="text-3xl font-semibold">Admin access required</h1><p className="mt-3 text-slate-400">Sign in as an admin to view the Flywheel.</p><button onClick={navigateToLogin} className="mt-7 rounded-lg bg-cyan-300 px-5 py-3 font-semibold text-slate-950">Sign in</button></section></div></main>;
  if (user.role !== 'admin') return <main className="min-h-screen bg-slate-950 text-white"><div className="mx-auto max-w-7xl"><Header/><section className="px-5 py-20 text-center"><h1 className="text-3xl font-semibold">Access restricted</h1><p className="mt-3 text-slate-400">The Flywheel is available to admins only.</p></section></div></main>;
  return <main className="min-h-screen bg-slate-950 text-white"><div className="mx-auto min-h-screen max-w-7xl border-x border-white/10"><Header/><section className="mx-auto max-w-6xl px-5 pb-12 pt-6 sm:pb-20 sm:pt-10"><FlywheelDashboard progress={progress}/></section></div></main>;
}