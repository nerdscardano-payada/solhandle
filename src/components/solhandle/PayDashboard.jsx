import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { authorizedPayments } from '@/lib/payAuth';

const short = value => value ? `${value.slice(0, 6)}…${value.slice(-4)}` : '—';
export default function PayDashboard() {
  const { publicKey, signMessage } = useWallet();
  const [tab, setTab] = useState('incoming');
  const [records, setRecords] = useState({ incoming: null, outgoing: null });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const wallet = publicKey?.toBase58();
  const items = records[wallet]?.[tab] ?? null;
  const load = async () => {
    setBusy(true); setError('');
    try {
      const data = await authorizedPayments(tab, publicKey, signMessage);
      setRecords(current => ({ ...current, [wallet]: { ...current[wallet], [tab]: data.payments } }));
    } catch (e) { setError(e.response?.data?.error || e.message || 'Could not load payments.'); }
    finally { setBusy(false); }
  };
  return <section className="card-glow mt-8">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">SolHandle Pay</p><h2 className="mt-1 text-xl font-semibold text-white">Your payments</h2></div><Link to="/pay" className="rounded-lg bg-gradient-to-r from-emerald-300 via-cyan-400 to-violet-500 px-5 py-2.5 text-sm font-semibold text-slate-950">Send SOL to an @handle</Link></div>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><div className="flex rounded-lg border border-white/10 bg-slate-900/70 p-1" role="tablist" aria-label="Payment direction">{['incoming', 'outgoing'].map(value => <button key={value} type="button" role="tab" aria-selected={tab === value} onClick={() => { setTab(value); setError(''); }} className={`rounded-md px-4 py-2 text-sm font-medium transition ${tab === value ? 'bg-cyan-300/15 text-cyan-200' : 'text-slate-400 hover:text-white'}`}>{value === 'incoming' ? 'Incoming' : 'Outgoing'}</button>)}</div><button type="button" onClick={load} disabled={!wallet || !signMessage || busy} className="rounded-lg border border-cyan-300/40 px-4 py-2 text-sm font-semibold text-cyan-200 disabled:opacity-50">{busy ? 'Loading…' : items ? 'Refresh payments' : 'View payments'}</button></div>
    {!wallet && <p className="mt-4 text-sm text-slate-400">Connect your wallet to see your payments.</p>}
    {wallet && !signMessage && <p className="mt-4 text-sm text-slate-400">Your wallet needs message signing to view private payment history.</p>}
    {error && <p role="alert" className="mt-4 text-sm text-rose-300">{error} <button type="button" onClick={load} className="underline">Retry</button></p>}
    {items && (items.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2">{items.map(p => <Link key={p.id} to={`/pay?receipt=${encodeURIComponent(p.id)}`} className="min-w-0 rounded-xl border border-white/10 bg-slate-900/70 p-4 transition hover:border-cyan-300/50"><p className={`text-lg font-semibold ${tab === 'incoming' ? 'text-emerald-200' : 'text-violet-200'}`}>{tab === 'incoming' ? '+' : '−'}{(p.amount_lamports / 1e9).toLocaleString('en-US', { maximumFractionDigits: 9 })} SOL</p><p className="mt-1 text-sm text-white">{tab === 'incoming' ? `From ${p.sender_primary_handle || short(p.sender_wallet)}` : `To ${p.handle || short(p.receiver_wallet)}`}</p><p className="mt-2 text-xs text-slate-400">{new Date(p.confirmed_at || p.created_at).toLocaleString()}</p><span className="mt-2 inline-block text-xs text-cyan-300">Receipt & Explorer →</span></Link>)}</div> : <p className="mt-4 text-sm text-slate-400">No confirmed {tab} payments yet.</p>)}
  </section>;
}