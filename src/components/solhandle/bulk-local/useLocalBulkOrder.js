import { useState, useRef, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { prepareLocalOrder, prepareLocalBatch } from '@/components/solhandle/bulk-local/localPrepare';
import { confirmLocalBatch } from '@/components/solhandle/bulk-local/localConfirm';
import { localRpc, localGenesis, encode64, signature58 } from '@/components/solhandle/bulk-local/localRpc';
const storageKey = 'solhandle-local-bulk-order-v1';
export default function useLocalBulkOrder() {
  const { publicKey, signTransaction } = useWallet();
  const [order, setOrder] = useState(() => { try { return JSON.parse(localStorage.getItem(storageKey) || 'null'); } catch { return null; } });
  const [busy, setBusy] = useState(false), [error, setError] = useState(''); const lock = useRef(false);
  const save = next => { if (next) localStorage.setItem(storageKey, JSON.stringify(next)); else localStorage.removeItem(storageKey); setOrder(next); };
  const run = async action => { if (lock.current) return; lock.current = true; setBusy(true); setError(''); try { await action(); } catch (caught) { setError(caught.message || 'Local minting failed.'); } finally { lock.current = false; setBusy(false); } };
  const updateBatch = (current, index, batch) => { const next = { ...current, batches: current.batches.map((item, i) => i === index ? batch : item) }; save(next); return next; };
  const review = names => run(async () => {
    if (!publicKey || !signTransaction) throw new Error('Connect a local test wallet with transaction signing support.');
    if (order) throw new Error('Finish or discard the saved order before reviewing another.');
    save(await prepareLocalOrder(names, publicKey.toBase58()));
  });
  const check = () => run(async () => {
    if (!order) return;
    const index = order.batches.findIndex(batch => batch.status === 'pending');
    if (index < 0) return;
    updateBatch(order, index, await confirmLocalBatch(order.batches[index], order));
  });
  const mintNext = () => run(async () => {
    if (!order || !publicKey || order.wallet !== publicKey.toBase58() || !signTransaction) throw new Error('Reconnect the test wallet that reviewed this order.');
    if (order.batches.some(batch => batch.status === 'pending')) throw new Error('Check the saved transaction before minting another batch.');
    const index = order.batches.findIndex(batch => batch.status !== 'confirmed'); if (index < 0) return;
    const batch = order.batches[index], prepared = await prepareLocalBatch(batch.items, order.wallet, order.genesis);
    if (prepared.estimatedDebit > batch.estimatedDebit + 10000) throw new Error('Local account costs increased. Discard the remaining order and review again.');
    const signed = await signTransaction(prepared.transaction); await localGenesis(order.genesis);
    if (!signed.signature) throw new Error('The wallet did not return a signed transaction.');
    const pending = { ...batch, status: 'pending', signature: signature58(signed.signature), raw: encode64(signed.serialize()), lastValidBlockHeight: prepared.block.lastValidBlockHeight, error: '' };
    const current = updateBatch(order, index, pending);
    await localRpc('sendTransaction', [pending.raw, { encoding: 'base64', skipPreflight: false, preflightCommitment: 'confirmed', maxRetries: 3 }]);
    updateBatch(current, index, await confirmLocalBatch(pending, current));
  });
  const rebroadcast = () => run(async () => {
    const index = order?.batches.findIndex(batch => batch.status === 'pending'); if (index == null || index < 0) return;
    const checked = await confirmLocalBatch(order.batches[index], order); updateBatch(order, index, checked);
    if (checked.status !== 'pending') return;
    await localRpc('sendTransaction', [checked.raw, { encoding: 'base64', skipPreflight: false, preflightCommitment: 'confirmed', maxRetries: 3 }]);
  });
  const reset = () => { if (busy || order?.batches.some(batch => batch.status === 'pending')) return false; save(null); setError(''); return true; };
  useEffect(() => { if (!order?.batches.some(batch => batch.status === 'pending')) return; const timer = setInterval(check, 5000); return () => clearInterval(timer); }, [order]);
  const discardResetLedger = () => run(async () => { if (!order || await localGenesis() === order.genesis) throw new Error('This ledger has not changed. Check the pending transaction instead.'); save(null); });
  return { order, busy, error, review, mintNext, check, rebroadcast, reset, discardResetLedger, walletMatches: !!publicKey && order?.wallet === publicKey.toBase58() };
}