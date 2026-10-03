import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { VersionedTransaction } from '@solana/web3.js';
import { base44 } from '@/api/base44Client';
const storageKey = 'solhandle_weekend_settlement';
const call = async body => (await base44.functions.invoke('weekendMintTransaction', body)).data;
export default function useWeekendSettlement(refresh) {
  const { publicKey, signTransaction } = useWallet();
  const [pending, setPending] = useState(() => { try { return JSON.parse(localStorage.getItem(storageKey) || 'null'); } catch { return null; } });
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  const save = value => { setPending(value); value ? localStorage.setItem(storageKey, JSON.stringify(value)) : localStorage.removeItem(storageKey); };
  const confirm = async () => {
    if (!pending || busy) return;
    setBusy(true); setError('');
    try { const result = await call({ action: 'confirm', intent_id: pending.intent_id }); if (['confirmed','expired','failed','prepared'].includes(result.status)) { save(null); refresh(); if (result.status !== 'confirmed') setError(result.status === 'prepared' ? 'Transaction was not submitted; you can prepare it again.' : `Transaction ${result.status}; no confirmed payment was recorded.`); } }
    catch (e) { setError(e.response?.data?.error || e.message); } finally { setBusy(false); }
  };
  useEffect(() => { if (!pending) return; const timer = setInterval(confirm, 5000); return () => clearInterval(timer); }, [pending, busy]);
  const approve = async (kind, recipient = '') => {
    if (!publicKey || !signTransaction) { setError('Connect the funded payout wallet first.'); return; }
    if (pending) { setError('Confirm the pending settlement before starting another.'); return; }
    setBusy(true); setError('');
    try {
      const prepared = await call({ action: 'prepare', kind, recipient, wallet: publicKey.toBase58() });
      const accepted = window.confirm(kind === 'reward' ? `Send 100,000 $HANDLE to ${recipient}? Your wallet pays token-account rent if needed and network fees.` : `Permanently burn ${prepared.tokens.toLocaleString('en-US')} $HANDLE from your connected wallet? This cannot be undone.`);
      if (!accepted) return;
      const signed = await signTransaction(VersionedTransaction.deserialize(Uint8Array.from(atob(prepared.unsigned), c => c.charCodeAt(0))));
      const saved = { intent_id: prepared.intent_id, signed: btoa(String.fromCharCode(...signed.serialize())), wallet: publicKey.toBase58() }; save(saved);
      const result = await call({ action: 'submit', ...saved });
      if (['confirmed','expired','failed'].includes(result.status)) { save(null); refresh(); if (result.status !== 'confirmed') setError(`Transaction ${result.status}.`); }
    } catch (e) { setError(e.response?.data?.error || e.message); } finally { setBusy(false); }
  };
  const resend = async () => { if (!pending || busy) return; setBusy(true); setError(''); try { const result = await call({ action: 'submit', ...pending }); if (['confirmed','expired','failed'].includes(result.status)) { save(null); refresh(); } } catch(e) { setError(e.response?.data?.error || e.message); } finally { setBusy(false); } };
  return { approve, confirm, resend, pending, busy, error, wallet: publicKey?.toBase58() };
}