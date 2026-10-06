import { useEffect, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { VersionedTransaction } from '@solana/web3.js';
import { base44 } from '@/api/base44Client';
const storageKey = 'solhandle_weekend_settlement';
const call = async body => (await base44.functions.invoke('weekendMintTransaction', body)).data;
export default function useWeekendSettlement(refresh) {
  const { publicKey, signTransaction } = useWallet();
  const [pending, setPending] = useState(() => { try { return JSON.parse(localStorage.getItem(storageKey) || 'null'); } catch { return null; } });
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  const inFlight = useRef(false);
  const save = value => { setPending(value); value ? localStorage.setItem(storageKey, JSON.stringify(value)) : localStorage.removeItem(storageKey); };
  const confirm = async () => {
    if (!pending || inFlight.current) return;
    inFlight.current = true; setBusy(true);
    try { const result = await call({ action: 'confirm', intent_id: pending.intent_id }); if (['confirmed','expired','failed'].includes(result.status)) { save(null); refresh(); setError(result.status === 'confirmed' ? '' : `Transaction ${result.status}; no confirmed payment was recorded.`); } else if (result.status === 'prepared') setError(previous => previous || 'Payment has not been broadcast. Use Resend same signed transaction; do not approve a second payment.'); }
    catch (e) { setError(previous => previous || e.response?.data?.error || e.message); } finally { inFlight.current = false; setBusy(false); }
  };
  useEffect(() => { if (!pending || busy || error) return; const timer = setInterval(resend, 10000); return () => clearInterval(timer); }, [pending, busy, error]);
  const approve = async (kind, recipient = '') => {
    if (!publicKey || !signTransaction) { setError('Connect the funded payout wallet first.'); return; }
    if (pending) { setError('Confirm the pending settlement before starting another.'); return; }
    if (inFlight.current) return;
    inFlight.current = true; setBusy(true); setError('');
    try {
      const accepted = window.confirm(kind === 'reward' ? `Send 100,000 $HANDLE to ${recipient}? Your wallet pays token-account rent if needed and network fees.` : 'Permanently burn $HANDLE from your connected wallet? This cannot be undone. Review the amount in your wallet.');
      if (!accepted) return;
      const prepared = await call({ action: 'prepare', kind, recipient, wallet: publicKey.toBase58() });
      const signed = await signTransaction(VersionedTransaction.deserialize(Uint8Array.from(atob(prepared.unsigned), c => c.charCodeAt(0))));
      const saved = { intent_id: prepared.intent_id, signed: btoa(String.fromCharCode(...signed.serialize())), wallet: publicKey.toBase58() }; save(saved);
      const result = await call({ action: 'submit', ...saved });
      if (['confirmed','expired','failed'].includes(result.status)) { save(null); refresh(); if (result.status !== 'confirmed') setError(`Transaction ${result.status}.`); }
    } catch (e) { setError(e.response?.data?.error || e.message); } finally { inFlight.current = false; setBusy(false); }
  };
  const resend = async () => { if (!pending || inFlight.current) return; inFlight.current = true; setBusy(true); setError(''); try { const result = await call({ action: 'submit', ...pending }); if (['confirmed','expired','failed'].includes(result.status)) { save(null); refresh(); if (result.status !== 'confirmed') setError(`Transaction ${result.status}; approve a fresh transaction.`); } } catch(e) { setError(e.response?.data?.error || e.message); } finally { inFlight.current = false; setBusy(false); } };
  return { approve, confirm, resend, pending, busy, error, wallet: publicKey?.toBase58() };
}