import { useMemo, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { base44 } from '@/api/base44Client';
import { createDevnetIntegration } from '@/lib/solhandle-sdk/examples/partner-mint-devnet';
import { pilotMessage } from '@/components/solhandle/partner-mint/partnerPilotClient';
const terminal = record => ['FINALIZED', 'FAILED'].includes(record?.status) || (record?.status === 'EXPIRED' && (!record.signature || record.expiredWithoutReceiptVerified));
export default function usePartnerMintSdkExample(partnerId) {
  const wallet = useWallet(), current = useRef(wallet), lock = useRef(false); current.current = wallet;
  const key = `solhandle-sdk-devnet:${partnerId}`;
  const sdk = useMemo(() => createDevnetIntegration({ partnerId, invoke: (name, payload) => base44.functions.invoke(name, payload) }), [partnerId]);
  const [record, setRecord] = useState(() => { try { const saved = JSON.parse(localStorage.getItem(key) || 'null'); return saved?.cluster === 'devnet' && saved.partnerId === partnerId && saved.signedTransaction ? saved : null; } catch { return null; } });
  const [availability, setAvailability] = useState(null), [prepared, setPrepared] = useState(null), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const save = value => { setRecord(value); if (value) localStorage.setItem(key, JSON.stringify(value)); else localStorage.removeItem(key); };
  const run = async action => {
    if (lock.current) return; lock.current = true; setBusy(true); setError('');
    try { await action(); } catch (e) {
      if (e.prepared) setPrepared(e.prepared);
      if (e.signedRecord) setRecord(e.signedRecord);
      setError(`${e.code ? `${e.code}: ` : ''}${pilotMessage(e)}`);
    } finally { lock.current = false; setBusy(false); }
  };
  const resetReview = () => { setAvailability(null); setPrepared(null); setError(''); };
  const search = handle => run(async () => { setPrepared(null); setAvailability(null); setAvailability(await sdk.checkAvailability(handle)); });
  const review = handle => run(async () => {
    if (record) throw new Error('Controleer eerst de opgeslagen transactie.');
    setPrepared(null); const result = await sdk.review(handle, current.current); setPrepared(result.prepared);
  });
  const mint = () => run(async () => {
    if (record) throw new Error('Controleer eerst de opgeslagen transactie.');
    const adapter = current.current.wallet?.adapter;
    const signer = { get publicKey() { return current.current.publicKey; }, signTransaction: transaction => {
      if (!current.current.connected || current.current.wallet?.adapter !== adapter) throw new Error('De wallet is gewijzigd. Verbind opnieuw en bekijk de kosten.');
      return current.current.signTransaction(transaction);
    } };
    save(await sdk.confirm({ prepared, wallet: signer, persistSigned: save }));
  });
  const check = () => run(async () => { if (record) save({ ...record, ...await sdk.status(record.intentId) }); });
  const retry = () => run(async () => { if (record) save({ ...record, ...await sdk.relaySaved(record) }); });
  const clear = () => run(async () => { if (!terminal(record)) throw new Error('Deze transactie is nog niet definitief afgehandeld.'); save(null); resetReview(); });
  return { wallet, record, availability, prepared, busy, error, search, review, mint, check, retry, clear, resetReview };
}