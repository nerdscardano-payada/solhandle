import { useRef, useState } from 'react';
import { VersionedTransaction } from '@solana/web3.js';
import { pilotCall, pilotMessage, from64, to64 } from '@/components/solhandle/partner-mint/partnerPilotClient';
const storageKey = 'solhandle-partner-devnet-intent';
export default function usePartnerMintPilot(wallet, partnerId) {
  const [record, setRecord] = useState(() => { try { return JSON.parse(localStorage.getItem(storageKey) || 'null'); } catch { return null; } });
  const [quote, setQuote] = useState(null), [availability, setAvailability] = useState(null), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const lock = useRef(false);
  const save = value => { if (value) localStorage.setItem(storageKey, JSON.stringify(value)); else localStorage.removeItem(storageKey); setRecord(value); };
  const run = async action => { if (lock.current) return; lock.current = true; setBusy(true); setError(''); try { await action(); } catch (e) { setError(pilotMessage(e)); } finally { lock.current = false; setBusy(false); } };
  const check = () => run(async () => {
    if (!record) return;
    const result = await pilotCall('status', { intentId: record.intentId }); save({ ...record, ...result });
  });
  const retry = () => run(async () => {
    if (!record?.signedTransaction) return;
    const current = await pilotCall('status', { intentId: record.intentId });
    if (['FINALIZED', 'CONFIRMED', 'FAILED'].includes(current.status) || (current.status === 'EXPIRED' && !current.signature)) { save({ ...record, ...current }); return; }
    const result = await pilotCall('submit', { intentId: record.intentId, signedTransaction: record.signedTransaction }); save({ ...record, ...result });
  });
  const search = handle => run(async () => { setQuote(null); setAvailability(null); setAvailability(await pilotCall('availability', { partnerId, handle })); });
  const review = handle => run(async () => {
    if (record) throw new Error('Resolve the saved Devnet intent first.');
    if (!wallet.publicKey || !wallet.signTransaction) throw new Error('Connect a signing wallet on Devnet first.');
    const result = await pilotCall('quote', { partnerId, handle, wallet: wallet.publicKey.toBase58() }); setQuote(result);
  });
  const mint = () => run(async () => {
    if (record || !quote || quote.quote.wallet !== wallet.publicKey?.toBase58() || !wallet.signTransaction) throw new Error('Review a quote for your connected wallet first.');
    if (Date.now() >= Date.parse(quote.expiresAt)) { setQuote(null); throw new Error('Quote expired. Request a fresh quote.'); }
    const prepared = await pilotCall('prepare', { intentId: quote.intentId });
    const signed = await wallet.signTransaction(VersionedTransaction.deserialize(from64(prepared.transactionBase64)));
    const pending = { intentId: quote.intentId, handle: quote.quote.handle, partnerId, wallet: quote.quote.wallet, signedTransaction: to64(signed.serialize()), status: 'SIGNED' };
    save(pending); setQuote(null);
    const result = await pilotCall('submit', { intentId: pending.intentId, signedTransaction: pending.signedTransaction }); save({ ...pending, ...result });
  });
  return { record, quote, availability, busy, error, search, review, mint, check, retry, resetQuote: () => { setQuote(null); setAvailability(null); }, clear: () => { save(null); setQuote(null); setAvailability(null); } };
}