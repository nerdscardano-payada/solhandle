import { useEffect, useState } from 'react';
import { Transaction } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { base44 } from '@/api/base44Client';
const storageKey = 'solhandle_token_lookup_setup';
const request = async payload => (await base44.functions.invoke('tokenPaymentLookupSetup', payload)).data;
const to64 = bytes => btoa(String.fromCharCode(...bytes));
function signature58(bytes) {
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'; let n = 0n, value = '';
  for (const byte of bytes) n = n * 256n + BigInt(byte);
  while (n) { value = alphabet[Number(n % 58n)] + value; n /= 58n; }
  for (const byte of bytes) { if (byte) break; value = '1' + value; } return value;
}
export default function useTokenLookupSetup() {
  const { publicKey, signTransaction } = useWallet(), wallet = publicKey?.toBase58() || '';
  const [status, setStatus] = useState(null), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const [receipt, setReceipt] = useState(() => { try { return JSON.parse(localStorage.getItem(storageKey) || 'null'); } catch { return null; } });
  const save = next => { setReceipt(next); if (next) localStorage.setItem(storageKey, JSON.stringify(next)); else localStorage.removeItem(storageKey); };
  const run = async action => { setBusy(true); setError(''); try { await action(); } catch (caught) { setError(caught.response?.data?.error || caught.message); } finally { setBusy(false); } };
  const refresh = async () => setStatus(await request({ action: 'status' }));
  const check = async () => {
    const result = await request({ action: 'activate', address: receipt.address, signature: receipt.signature, blockhash: receipt.blockhash });
    save({ ...receipt, ...result }); if (result.error) setError(result.error); if (result.status === 'active') await refresh();
  };
  useEffect(() => { run(refresh); }, []);
  useEffect(() => {
    if (receipt?.status !== 'pending' || busy) return;
    const timer = setTimeout(() => run(check), 5000); return () => clearTimeout(timer);
  }, [receipt, busy]);
  const setup = () => run(async () => {
    if (!signTransaction || wallet !== status?.authority) throw new Error('Connect the protocol authority wallet first.');
    if (receipt?.status === 'pending') throw new Error('Check the saved setup before creating another.');
    const prepared = await request({ action: 'prepare', wallet });
    const tx = Transaction.from(Uint8Array.from(atob(prepared.transaction_base64), c => c.charCodeAt(0)));
    const signed = await signTransaction(tx);
    const next = { address: prepared.address, recentSlot: prepared.recentSlot, blockhash: signed.recentBlockhash, signature: signature58(signed.signature), transaction_base64: to64(signed.serialize()), status: 'pending' };
    save(next);
    const result = await request({ ...next, action: 'submit' }); save({ ...next, ...result }); if (result.error) setError(result.error);
  });
  const resend = () => run(async () => { const result = await request({ ...receipt, action: 'submit' }); save({ ...receipt, ...result }); if (result.error) setError(result.error); });
  return { status, receipt, busy, error, wallet, setup, check: () => run(check), resend, refresh: () => run(refresh) };
}