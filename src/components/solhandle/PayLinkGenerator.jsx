import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import QRCode from 'qrcode';
import { authorizedPayments } from '@/lib/payAuth';
import { Check, Copy, Download } from 'lucide-react';

export default function PayLinkGenerator({ handles, wallet, primaryHandle, loading }) {
  const { publicKey, signMessage } = useWallet();
  const [selected, setSelected] = useState('');
  const [created, setCreated] = useState(null);
  const [creating, setCreating] = useState(false);
  const [amount, setAmount] = useState('');
  const [qr, setQr] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const available = publicKey?.toBase58() === wallet && !loading ? handles : [];
  const names = available.map(item => String(item.handle).replace(/^@/, '').toLowerCase());
  const primary = String(primaryHandle || '').replace(/^@/, '').toLowerCase();
  const handle = names.includes(selected) ? selected : names.includes(primary) ? primary : names[0] || '';
  const validAmount = !amount || (/^\d+(\.\d{1,9})?$/.test(amount) && Number(amount) > 0 && Number.isSafeInteger(Math.round(Number(amount) * 1e9)));
  const key = `${wallet}:${handle}:${amount}`;
  const requestId = created?.key === key ? created.id : '';
  const url = requestId ? `${window.location.origin}/pay?request=@${handle}&link=${encodeURIComponent(requestId)}` : '';
  const createLink = async () => {
    setCreating(true); setError(''); setCreated(null);
    try {
      const data = await authorizedPayments('create_link', publicKey, signMessage, { handle, amount });
      setCreated({ key, id: data.requestId });
    } catch (e) { setError(e.response?.data?.error || e.message || 'Could not create payment link.'); }
    finally { setCreating(false); }
  };
  useEffect(() => {
    let alive = true;
    setQr(''); setError(''); setCopied(false);
    if (url) QRCode.toDataURL(url, { width: 320, margin: 2, color: { dark: '#06101e', light: '#ffffff' } }).then(image => { if (alive) setQr(image); }).catch(() => { if (alive) setError('Could not create QR code.'); });
    return () => { alive = false; };
  }, [url]);
  const download = () => { const a = document.createElement('a'); a.href = qr; a.download = `solhandle-pay-${handle}.png`; a.click(); };
  return <section className="card-glow mt-5"><p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">SolHandle Pay</p><h2 className="mt-1 text-xl font-semibold text-white">Create a payment link</h2><p className="mt-2 text-sm text-slate-400">Share a link or QR code so someone can send SOL to your @handle. The link is tied to your wallet at creation and becomes unusable if your @handle changes owner. The payer also verifies the recipient before sending.</p>
    {!publicKey ? <p className="mt-5 text-sm text-slate-400">Connect your wallet to create a link for your handles.</p> : loading || publicKey.toBase58() !== wallet ? <p className="mt-5 text-sm text-slate-400">Verifying your handles…</p> : !names.length ? <p className="mt-5 text-sm text-slate-400">Claim a SolHandle to create a payment link.</p> : <div className="mt-5 grid gap-6 md:grid-cols-[minmax(0,1fr)_auto]"><div className="min-w-0 space-y-4"><div><label htmlFor="link-handle" className="text-sm text-slate-200">Receive at</label><select id="link-handle" value={handle} onChange={e => setSelected(e.target.value)} className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300">{names.map(name => <option key={name} value={name}>@{name}</option>)}</select></div><div><label htmlFor="link-amount" className="text-sm text-slate-200">Requested amount (SOL, optional)</label><input id="link-amount" value={amount} onChange={e => setAmount(e.target.value)} inputMode="decimal" placeholder="e.g. 0.5" className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-300"/>{!validAmount && <p className="mt-2 text-xs text-rose-300">Enter a positive SOL amount with up to 9 decimal places.</p>}</div><button type="button" onClick={createLink} disabled={!validAmount || !signMessage || creating} className="rounded-lg border border-cyan-300/40 px-5 py-2.5 text-sm font-semibold text-cyan-200 disabled:opacity-50">{creating ? 'Verifying ownership…' : 'Create protected link'}</button>{!signMessage && <p className="text-xs text-amber-200">Your wallet must support message signing to create a protected link.</p>}{url && <div><p className="text-sm text-slate-200">Your payment link</p><div className="mt-2 break-all rounded-xl border border-cyan-300/25 bg-cyan-300/5 p-3 font-mono text-xs text-cyan-100">{url}</div><button type="button" onClick={async () => { try { await navigator.clipboard.writeText(url); setCopied(true); setError(''); } catch { setError('Could not copy the link.'); } }} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-300 via-cyan-400 to-violet-500 px-5 py-2.5 text-sm font-semibold text-slate-950">{copied ? <Check className="h-4 w-4"/> : <Copy className="h-4 w-4"/>}{copied ? 'Copied' : 'Copy link'}</button></div>}{error && <p role="alert" className="text-sm text-rose-300">{error}</p>}</div><div className="flex flex-col items-center gap-3">{qr ? <><img src={qr} alt={`Payment QR code for @${handle}`} className="h-48 w-48 rounded-xl bg-white p-2"/><button type="button" onClick={download} className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/40 px-4 py-2 text-sm font-semibold text-cyan-200"><Download className="h-4 w-4"/>Download PNG</button></> : url && <p className="text-xs text-slate-400">Creating QR code…</p>}</div></div>}
  </section>;
}