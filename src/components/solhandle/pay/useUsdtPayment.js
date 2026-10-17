import { useEffect, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';
import { base44 } from '@/api/base44Client';
import signPayTransaction from '@/lib/signPayTransaction';
import { contactPaymentProof } from '@/components/solhandle/contacts/contactClient';
import { parseUsdtAmount } from '@/components/solhandle/pay/usdtAmounts';
import { usdtPendingKey as storageKey, readUsdtPending as savedPending, usdtSignature } from '@/components/solhandle/pay/usdtPending';
const to64 = bytes => btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join(''));
const from64 = text => Uint8Array.from(atob(text), char => char.charCodeAt(0));
const errorText = error => error.response?.data?.error || error.message || 'Could not complete this payment.';
export default function useUsdtPayment({ asset = 'USDT', handle, contact, requestId, request, blocked, onComplete, onLockChange }) {
  const { publicKey, signTransaction, wallet } = useWallet(), address = publicKey?.toBase58() || '';
  const [amount, setAmount] = useState(request?.amount || ''), [quote, setQuote] = useState(null), [pending, setPending] = useState(() => savedPending(address, asset));
  const [busy, setBusy] = useState(''), [error, setError] = useState('');
  const inFlight = useRef(false), currentWallet = useRef(address);
  currentWallet.current = address;
  const amountRaw = parseUsdtAmount(amount), name = handle.trim().replace(/^@/, '').toLowerCase();
  const contactFields = () => requestId ? { requestId } : contact?.id ? { contactId: contact.id, ...contactPaymentProof(address) } : {};
  useEffect(() => { if (requestId) setAmount(request?.amount || ''); }, [requestId, request?.amount]);
  const storePending = value => { setPending(value); if (value) localStorage.setItem(storageKey(value.senderWallet, value.asset), JSON.stringify(value)); else if (address) localStorage.removeItem(storageKey(address, asset)); };
  useEffect(() => { setQuote(null); setError(''); setPending(savedPending(address, asset)); }, [address, asset]);
  useEffect(() => { setQuote(null); }, [name, amountRaw, contact?.id, requestId]);
  useEffect(() => { onLockChange(Boolean(busy || pending || quote)); return () => onLockChange(false); }, [busy, pending, quote, onLockChange]);
  const finish = (data, payload) => {
    if (currentWallet.current !== payload.senderWallet) return;
    if (data.pending) { setError(data.error); return; }
    if (data.failed || data.expired) { storePending(null); setQuote(null); setError(data.error); return; }
    if (!data.payment?.id) throw new Error('The receipt is not available yet. Check confirmation again.');
    storePending(null); setQuote(null); onComplete(data.payment);
  };
  const review = async () => {
    if (inFlight.current || pending || blocked) return;
    if (!address || !signTransaction) return setError('Connect a wallet capable of signing transactions.');
    if (!amountRaw) return setError(`Enter a positive ${asset} amount with up to 6 decimal places.`);
    inFlight.current = true; setBusy('review'); setError('');
    try { const response = await base44.functions.invoke('preparePayTransaction', { action: 'prepare', asset, handle: name, senderWallet: address, amountRaw, ...contactFields() }); if (currentWallet.current === address) setQuote(response.data); }
    catch (error) { setError(errorText(error)); } finally { inFlight.current = false; setBusy(''); }
  };
  const send = async () => {
    if (inFlight.current || pending || blocked || !quote || !publicKey || !signTransaction) return;
    inFlight.current = true; setBusy('send'); setError('');
    let payload = null;
    try {
      const fresh = (await base44.functions.invoke('preparePayTransaction', { action: 'prepare', asset, handle: name, senderWallet: address, amountRaw, ...contactFields() })).data;
      if (currentWallet.current !== address) throw new Error('The connected wallet changed. Review the payment again.');
      if (fresh.asset !== asset || quote.asset !== asset || fresh.savedContact !== quote.savedContact || fresh.handleChanged !== quote.handleChanged || fresh.destinationAddress !== quote.destinationAddress || fresh.mint !== quote.mint || fresh.amountRaw !== quote.amountRaw || fresh.networkFeeEstimate + fresh.accountCreationLamports > quote.networkFeeEstimate + quote.accountCreationLamports) { setQuote(fresh); setError('The recipient or SOL costs changed. Review the updated payment before approving.'); return; }
      const signed = await signPayTransaction(Transaction.from(from64(fresh.serializedTransaction)), wallet, publicKey, signTransaction);
      if (currentWallet.current !== address) throw new Error('The connected wallet changed. This attempt was not submitted.');
      payload = { asset, handle: name, senderWallet: address, amountRaw, ...(requestId ? { requestId } : contact?.id ? { contactId: contact.id } : {}), recipientWallet: fresh.destinationAddress, mint: fresh.mint, lastValidBlockHeight: fresh.lastValidBlockHeight, signedTransaction: to64(signed.serialize()), signature: usdtSignature(signed.signature) };
      storePending(payload); setQuote(fresh);
      const response = await base44.functions.invoke('preparePayTransaction', { ...payload, ...contactFields(), action: 'submit' });
      finish(response.data, payload);
    } catch (error) { if (error.response?.data?.notSubmitted) { storePending(null); setQuote(null); } setError(errorText(error)); }
    finally { inFlight.current = false; setBusy(''); }
  };
  const recover = async () => {
    if (!pending || inFlight.current) return;
    inFlight.current = true; setBusy('recover'); setError('');
    try { const response = await base44.functions.invoke('preparePayTransaction', { ...pending, action: 'recover' }); finish(response.data, pending); }
    catch (error) { setError(errorText(error)); } finally { inFlight.current = false; setBusy(''); }
  };
  return { walletAddress: address, amount, setAmount, amountRaw, quote, pending, busy, error, review, send, recover, edit: () => { setQuote(null); setError(''); }, canSign: Boolean(address && signTransaction) };
}