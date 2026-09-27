import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import useAdminTrades from '@/hooks/useAdminTrades';

export default function AdminTradeBell() {
  const { user } = useAuth();
  const adminId = user?.role === 'admin' ? user.id : null;
  const { trades, loading, error } = useAdminTrades(adminId, 25);
  const [open, setOpen] = useState(false);
  const key = `solhandle-admin-trades-seen-${adminId}`;
  const [seen, setSeen] = useState(() => adminId ? Number(localStorage.getItem(key) || 0) : 0);
  useEffect(() => { if (adminId) setSeen(Number(localStorage.getItem(key) || 0)); }, [adminId, key]);
  if (!adminId) return null;
  const unread = trades.filter(t => Date.parse(t.timestamp) > seen).length;
  const toggle = () => {
    if (!open && trades.length) {
      const latest = Math.max(...trades.map(t => Date.parse(t.timestamp) || 0));
      localStorage.setItem(key, String(latest)); setSeen(latest);
    }
    setOpen(!open);
  };
  return <div className="relative shrink-0"><button type="button" onClick={toggle} aria-label={`Admin trade alerts: ${unread} new`} aria-expanded={open} title="Admin trade alerts" className="relative rounded-xl border border-cyan-300/30 bg-slate-950 p-2 text-cyan-200"><Bell className="h-5 w-5"/>{unread > 0 && <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-cyan-300 px-1 text-[10px] font-bold text-slate-950">{unread > 9 ? '9+' : unread}</span>}</button>
    {open && <div className="fixed inset-x-3 top-28 z-[80] w-auto rounded-2xl border border-cyan-300/30 bg-slate-950 p-4 text-white shadow-2xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-3 sm:w-80"><h2 className="font-semibold">Market trades</h2>{loading ? <p className="mt-3 text-sm text-slate-400">Loading trades…</p> : error ? <p role="alert" className="mt-3 text-sm text-rose-300">{error}</p> : trades.length ? <div className="mt-3 max-h-60 space-y-2 overflow-y-auto">{trades.slice(0, 5).map(t => <p key={t.id} className="border-b border-white/10 pb-2 text-sm text-slate-300"><strong className="text-white">@{t.handle}</strong> sold for {(t.total_paid_lamports / 1e9).toFixed(3)} SOL<br/><span className="text-xs text-slate-500">{new Date(t.timestamp).toLocaleString()}</span></p>)}</div> : <p className="mt-3 text-sm text-slate-400">No confirmed Market trades yet.</p>}<Link onClick={() => setOpen(false)} to="/admin#trades" className="mt-4 block text-sm font-semibold text-cyan-300">View trade overview →</Link></div>}
  </div>;
}