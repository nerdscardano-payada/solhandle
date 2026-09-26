import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import Header from '@/components/solhandle/Header';
import FlywheelDashboard from '@/components/solhandle/FlywheelDashboard';

export default function Flywheel() {
  const [progress, setProgress] = useState(null);
  useEffect(() => {
    let active = true;
    base44.functions.invoke('growthCurve', { action: 'view' }).then(res => { if (active) setProgress(res.data?.cycle?.max_progress ?? null); });
    return () => { active = false; };
  }, []);
  return <main className="min-h-screen bg-slate-950 text-white"><div className="mx-auto min-h-screen max-w-7xl border-x border-white/10"><Header/><section className="mx-auto max-w-6xl px-5 pb-12 sm:pb-20"><FlywheelDashboard progress={progress}/></section></div></main>;
}