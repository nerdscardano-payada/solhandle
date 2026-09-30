import { useEffect, useState } from 'react';
import { Transaction, VersionedTransaction } from '@solana/web3.js';
import { base44 } from '@/api/base44Client';
const storageKey = 'solhandle_public_token_mint';
const from64 = value => Uint8Array.from(atob(value), c => c.charCodeAt(0));
const to64 = value => btoa(String.fromCharCode(...value));
function signature58(bytes) {
  let n = 0n, result = ''; const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  for (const byte of bytes) n = n * 256n + BigInt(byte);
  while (n) { result = alphabet[Number(n % 58n)] + result; n /= 58n; }
  for (const byte of bytes) { if (byte) break; result = '1' + result; } return result;
}
const request = async payload => (await base44.functions.invoke('handleTokenMintTransaction', payload)).data;
export default function usePublicHandleMint(wallet) {
  const [receipt, setReceipt] = useState(() => { try { return JSON.parse(localStorage.getItem(storageKey) || 'null'); } catch { return null; } });
  const [checking, setChecking] = useState(false), [error, setError] = useState('');
  const save = value => { if (value) localStorage.setItem(storageKey, JSON.stringify(value)); else localStorage.removeItem(storageKey); setReceipt(value); window.dispatchEvent(new Event('solhandle-token-receipt')); };
  useEffect(() => {
    const sync = () => { try { setReceipt(JSON.parse(localStorage.getItem(storageKey) || 'null')); } catch { setReceipt(null); } };
    window.addEventListener('storage', sync); window.addEventListener('solhandle-token-receipt', sync);
    return () => { window.removeEventListener('storage', sync); window.removeEventListener('solhandle-token-receipt', sync); };
  }, []);
  const confirm = async (current = receipt) => {
    if (!current || current.wallet !== wallet || checking) return null;
    setChecking(true); setError('');
    try { const response = await request({ action: 'confirm', signature: current.signature, blockhash: current.blockhash }); const next = { ...current, ...response }; save(next); return next; }
    catch (caught) { setError(caught.response?.data?.error || caught.message); return null; }
    finally { setChecking(false); }
  };
  useEffect(() => {
    if (receipt?.wallet !== wallet || receipt?.status !== 'pending') return;
    const timer = setInterval(() => confirm(), 3000); return () => clearInterval(timer);
  }, [receipt, wallet, checking]);
  const mint = async ({ handle, uri, quote, publicKey, signTransaction, premium }) => {
    if (receipt?.status === 'pending') throw new Error('Resolve your pending transaction before minting again.');
    if (!signTransaction || !quote || quote.wallet !== publicKey.toBase58() || quote.handle !== handle || !quote.paymentAvailable || !quote.quoteEligible || !quote.sufficientBalance || !quote.singleAccountSufficient) throw new Error('Review an eligible quote for this wallet first.');
    const prepared = await request({ action: 'prepare', handle, uri, wallet: publicKey.toBase58(), max_amount_raw: quote.totalRaw, sol_reference_lamports: quote.solReferenceLamports });
    const transaction = prepared.transaction_version === 0 ? VersionedTransaction.deserialize(from64(prepared.transaction_base64)) : Transaction.from(from64(prepared.transaction_base64));
    const signed = await signTransaction(transaction);
    const pending = { wallet: publicKey.toBase58(), handle, premium, asset: prepared.asset, signature: signature58(prepared.transaction_version === 0 ? signed.signatures[0] : signed.signature), blockhash: prepared.transaction_version === 0 ? signed.message.recentBlockhash : signed.recentBlockhash, status: 'pending' };
    save(pending);
    try { const response = await request({ action: 'submit', transaction_base64: to64(signed.serialize()) }); const next = { ...pending, ...response }; save(next); return next; }
    catch (caught) { if (caught.response?.status >= 400 && caught.response?.status < 500) { save(null); throw caught; } setError('Connection interrupted. Check the saved transaction before retrying.'); return pending; }
  };
  return { receipt: receipt?.wallet === wallet ? receipt : null, hasPending: receipt?.status === 'pending', checking, error, mint, confirm: () => confirm(), clear: () => save(null) };
}