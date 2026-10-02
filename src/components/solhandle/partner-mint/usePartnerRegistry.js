import { useRef, useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { VersionedTransaction } from '@solana/web3.js';
import registryCall from '@/components/solhandle/partner-mint/partnerRegistryClient';
import { from64, to64, pilotMessage } from '@/components/solhandle/partner-mint/partnerPilotClient';
const storageKey = 'solhandle-devnet-registry-operation';
export default function usePartnerRegistry(wallet) {
  const client = useQueryClient(), lock = useRef(false);
  const [record, setRecord] = useState(() => { try { return JSON.parse(localStorage.getItem(storageKey) || 'null'); } catch { return null; } });
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  const save = value => { if (value) localStorage.setItem(storageKey, JSON.stringify(value)); else localStorage.removeItem(storageKey); setRecord(value); };
  const query = useInfiniteQuery({ queryKey: ['partner-registry'], initialPageParam: null, queryFn: ({ pageParam }) => registryCall('list', pageParam ? { cursor: pageParam } : {}), getNextPageParam: page => page.hasMore ? page.nextCursor : undefined, refetchOnWindowFocus: false });
  const refresh = () => client.invalidateQueries({ queryKey: ['partner-registry'] });
  const run = async action => { if (lock.current) return; lock.current = true; setBusy(true); setError(''); try { await action(); } catch (e) { setError(pilotMessage(e)); } finally { lock.current = false; setBusy(false); } };
  const prepare = payload => run(async () => { if (record) throw new Error('Resolve or clear the saved registry change first.'); save(await registryCall('prepare', { ...payload, authority: wallet.publicKey?.toBase58() })); });
  const sign = () => run(async () => {
    if (!record?.transactionBase64 || !wallet.signTransaction) throw new Error('Connect a required signing wallet.');
    const current = wallet.publicKey?.toBase58(); if (!record.requiredSigners.includes(current)) throw new Error('This wallet is not a required signer for this change.');
    const tx = VersionedTransaction.deserialize(from64(record.transactionBase64)), original = tx.message.serialize();
    const signed = await wallet.signTransaction(tx), after = signed.message.serialize();
    if (original.length !== after.length || original.some((value, i) => value !== after[i])) throw new Error('The wallet modified the registry transaction. No changed transaction was saved or sent.');
    const complete = signed.signatures.every(signature => signature.some(byte => byte !== 0));
    save({ ...record, transactionBase64: to64(signed.serialize()), signedWallets: signed.signatures.map((signature, i) => signature.some(byte => byte !== 0) ? record.requiredSigners[i] : null).filter(Boolean), complete });
  });
  const submit = () => run(async () => { const result = await registryCall('submit', { intentId: record.intentId, signedTransaction: record.transactionBase64 }); save({ ...record, ...result }); refresh(); });
  const check = (saved = record) => run(async () => { const result = await registryCall('status', { intentId: saved.intentId || saved.id }); if (record?.intentId === (saved.intentId || saved.id)) save({ ...record, ...result }); else setError(`Saved ${saved.operation} change: ${result.status}`); refresh(); });
  const sync = payload => run(async () => { await registryCall('sync', payload); refresh(); });
  return { query, record, busy, error, prepare, sign, submit, check, sync, clear: () => save(null), profiles: query.data?.pages.flatMap(page => page.profiles) || [], settings: query.data?.pages[0]?.settings, history: query.data?.pages[0]?.history || [] };
}