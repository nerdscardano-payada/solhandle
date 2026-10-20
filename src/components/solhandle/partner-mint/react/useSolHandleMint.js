import { useMemo, useRef, useState, useEffect } from 'react';
import { createDevnetIntegration } from '@/lib/solhandle-sdk/examples/partner-mint-devnet';
const terminal = record => ['FINALIZED', 'FAILED'].includes(record?.status) || (record?.status === 'EXPIRED' && (!record.signature || record.expiredWithoutReceiptVerified));
export default function useSolHandleMint({ partnerId, wallet, invoke, onSuccess, onError }) {
  const current = useRef(wallet), transport = useRef(invoke), callbacks = useRef({ onSuccess, onError }), lock = useRef(false), notified = useRef(null);
  current.current = wallet; transport.current = invoke; callbacks.current = { onSuccess, onError };
  const key = `solhandle-sdk-devnet:${partnerId}`;
  const sdk = useMemo(() => createDevnetIntegration({ partnerId, invoke: (...args) => transport.current(...args) }), [partnerId]);
  const [record, setRecord] = useState(() => { try { const saved = JSON.parse(localStorage.getItem(key) || 'null'); return saved?.cluster === 'devnet' && saved.partnerId === partnerId && saved.signedTransaction ? saved : null; } catch { return null; } });
  const [availability, setAvailability] = useState(null), [prepared, setPrepared] = useState(null), [busy, setBusy] = useState(false), [error, setError] = useState('');
  useEffect(() => {
    if (record?.status === 'FINALIZED' && record.receipt && notified.current !== record.intentId) { notified.current = record.intentId; callbacks.current.onSuccess?.(record); }
  }, [record]);
  const save = value => { setRecord(value); if (value) localStorage.setItem(key, JSON.stringify(value)); else localStorage.removeItem(key); };
  const run = async action => {
    if (lock.current) return; lock.current = true; setBusy(true); setError('');
    try { await action(); } catch (e) {
      if (e.prepared) setPrepared(e.prepared);
      if (e.signedRecord) setRecord(e.signedRecord);
      setError(`${e.code ? `${e.code}: ` : ''}${e.response?.data?.error?.message || e.message}`);
      callbacks.current.onError?.(e);
    } finally { lock.current = false; setBusy(false); }
  };
  const resetReview = () => { setAvailability(null); setPrepared(null); setError(''); };
  const search = handle => run(async () => { if (record) return; setPrepared(null); setAvailability(null); setAvailability(await sdk.checkAvailability(handle)); });
  const review = handle => run(async () => {
    if (record) throw new Error('Controleer eerst de opgeslagen transactie.');
    setPrepared(null); const result = await sdk.review(handle, current.current); setPrepared(result.prepared);
  });
  const mint = () => run(async () => {
    if (record) throw new Error('Controleer eerst de opgeslagen transactie.');
    const selected = current.current, adapter = selected.wallet?.adapter;
    const signer = { get publicKey() { return current.current.publicKey; }, signTransaction: transaction => {
      if (!current.current.connected || (adapter ? current.current.wallet?.adapter !== adapter : current.current.signTransaction !== selected.signTransaction)) throw new Error('De wallet is gewijzigd. Verbind opnieuw en bekijk de kosten.');
      return current.current.signTransaction(transaction);
    } };
    save(await sdk.confirm({ prepared, wallet: signer, persistSigned: save }));
  });
  const check = () => run(async () => { if (record) save({ ...record, ...await sdk.status(record.intentId) }); });
  const retry = () => run(async () => { if (record) save({ ...record, ...await sdk.relaySaved(record) }); });
  const clear = () => run(async () => { if (!terminal(record)) throw new Error('Deze transactie is nog niet definitief afgehandeld.'); save(null); resetReview(); });
  return { wallet, record, availability, prepared, busy, error, search, review, mint, check, retry, clear, resetReview, runConnection: action => run(action) };
}