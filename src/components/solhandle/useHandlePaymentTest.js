import { useCallback, useEffect, useRef, useState } from 'react';
import { Transaction } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { base44 } from '@/api/base44Client';
import { buildHandlePngBlob } from '@/lib/buildHandlePng';
const storageKey = 'solhandle_admin_token_test_receipt';
const restoredReceipt = () => { try { return JSON.parse(localStorage.getItem(storageKey) || 'null'); } catch { return null; } };
const from64 = value => Uint8Array.from(atob(value), c => c.charCodeAt(0));
const to64 = value => btoa(String.fromCharCode(...value));
export default function useHandlePaymentTest() {
  const { publicKey, signTransaction } = useWallet(), wallet = publicKey?.toBase58() || '';
  const [handle, setHandle] = useState(''), [quote, setQuote] = useState(null), [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(''), [error, setError] = useState(''), [result, setResult] = useState(restoredReceipt), [acknowledged, setAcknowledged] = useState(false);
  const [configurationError, setConfigurationError] = useState('');
  const current = useRef({ wallet, handle }); current.current = { wallet, handle };
  const request = async payload => (await base44.functions.invoke('handleTokenMintTest', payload)).data;
  const refresh = useCallback(async () => { const res = await base44.functions.invoke('handleTokenMintTest', { action: 'status' }); setStatus(res.data); }, []);
  const run = async (label, action) => {
    const configuring = label === 'Preparing configuration…';
    setBusy(label); setError('');
    if (configuring) setConfigurationError('');
    try { await action(); }
    catch (caught) {
      const message = caught.response?.data?.error || caught.message || 'Unable to continue.';
      setError(message);
      if (configuring) setConfigurationError(message);
    } finally { setBusy(''); }
  };
  useEffect(() => { run('Loading status…', refresh); }, [refresh]);
  useEffect(() => { setQuote(null); setAcknowledged(false); }, [handle, wallet]);
  useEffect(() => { if (result) localStorage.setItem(storageKey, JSON.stringify(result)); else localStorage.removeItem(storageKey); }, [result]);
  const getQuote = () => run('Getting quote…', async () => {
    const captured = { wallet, handle };
    const response = await base44.functions.invoke('quoteHandlePayment', { action: 'preview_test', handle, wallet });
    if (current.current.wallet === captured.wallet && current.current.handle === captured.handle) setQuote(response.data);
  });
  const approve = async (prepared, action, expectedWallet) => {
    if (current.current.wallet !== expectedWallet) throw new Error('Wallet changed. Review the transaction again.');
    if (!signTransaction) throw new Error('Connect a wallet that supports transaction signing.');
    setBusy('Approve in your wallet…');
    const signed = await signTransaction(Transaction.from(from64(prepared.transaction_base64)));
    setBusy('Confirming on Solana…');
    // Retain the deterministic signature even if submission or confirmation loses its connection.
    const bytes = signed.signature;
    let encoded = '', number = 0n;
    for (const byte of bytes) number = number * 256n + BigInt(byte);
    const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    while (number) { encoded = alphabet[Number(number % 58n)] + encoded; number /= 58n; }
    for (const byte of bytes) { if (byte) break; encoded = '1' + encoded; }
    setResult({ signature: encoded, status: 'pending', kind: action });
    let receipt;
    try { receipt = await request({ action, transaction_base64: to64(signed.serialize()) }); }
    catch (caught) {
      if (caught.response?.status >= 400 && caught.response?.status < 500) setResult(null);
      throw caught;
    }
    setResult({ ...receipt, kind: action });
    if (receipt.error) {
      setError(receipt.error);
      if (action === 'submit_configuration') setConfigurationError(receipt.error);
    }
    if (action === 'submit_configuration' && receipt.status === 'confirmed' && receipt.configuration) {
      setStatus(previous => ({ ...previous, ...receipt.configuration }));
      setConfigurationError('');
    }
    if (receipt.status === 'confirmed' && receipt.payment) await base44.functions.invoke('syncSolHandleIndex', { signature: receipt.signature });
    await refresh();
  };
  const configure = () => run('Preparing configuration…', async () => {
    if (!acknowledged) throw new Error('Acknowledge the real mainnet transaction first.');
    const prepared = await request({ action: 'prepare_configuration', wallet });
    await approve(prepared, 'submit_configuration', wallet);
  });
  const mint = () => run('Preparing NFT metadata…', async () => {
    if (!acknowledged || !quote || quote.wallet !== wallet || quote.handle !== handle.replace(/^@/, '').trim().toLowerCase()) throw new Error('Review a quote for your connected wallet first.');
    const png = await buildHandlePngBlob(quote.handle);
    const image = await base44.integrations.Core.UploadPublicFile({ file: png });
    const metadata = await base44.functions.invoke('uploadProtocolMetadata', { handle: quote.handle, image_url: image.file_url });
    const prepared = await request({ action: 'prepare', wallet, handle: quote.handle, uri: metadata.data.uri, max_amount_raw: quote.totalRaw, sol_reference_lamports: quote.solReferenceLamports });
    await approve(prepared, 'submit', wallet);
  });
  const confirm = () => run('Checking transaction…', async () => {
    const receipt = await request({ action: 'confirm', signature: result.signature });
    setResult({ ...receipt, kind: result.kind }); if (receipt.error) setError(receipt.error);
    if (receipt.status === 'confirmed' && receipt.payment) await base44.functions.invoke('syncSolHandleIndex', { signature: receipt.signature });
    await refresh();
  });
  return { wallet, handle, setHandle, quote, status, busy, error, configurationError, result, acknowledged, setAcknowledged, getQuote, configure, mint, confirm, refresh: () => run('Refreshing…', refresh), clearResult: () => { setResult(null); setQuote(null); setAcknowledged(false); } };
}