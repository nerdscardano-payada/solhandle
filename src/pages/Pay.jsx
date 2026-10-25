import { useEffect, useRef, useState } from 'react';
import usePullToRefresh from '@/hooks/usePullToRefresh';
import PullRefreshStatus from '@/components/solhandle/PullRefreshStatus';
import { useWallet } from '@solana/wallet-adapter-react';
import { Link, useLocation } from 'react-router-dom';
import { Transaction } from '@solana/web3.js';
import { base44 } from '@/api/base44Client';
import { authorizedPayments } from '@/lib/payAuth';
import signPayTransaction from '@/lib/signPayTransaction';
import Header from '@/components/solhandle/Header';
import PaymentReceipt from '@/components/solhandle/PaymentReceipt';
import SolPayReview from '@/components/solhandle/pay/SolPayReview';
import SolPayPending from '@/components/solhandle/pay/SolPayPending';
import PayRequestNotice from '@/components/solhandle/requests/PayRequestNotice';
import PayMascotHeading from '@/components/solhandle/PayMascotHeading';
import ContactPicker from '@/components/solhandle/contacts/ContactPicker';
import ContactRecipientNotice from '@/components/solhandle/contacts/ContactRecipientNotice';
import NetworkPayContextNotice from '@/components/solhandle/network/NetworkPayContextNotice';
import PayAssetSelect from '@/components/solhandle/pay/PayAssetSelect';
import UsdtPayment from '@/components/solhandle/pay/UsdtPayment';
import { readUsdtPending } from '@/components/solhandle/pay/usdtPending';
import usePaymentAttempt from '@/components/solhandle/pay/usePaymentAttempt';
import { contactPaymentProof } from '@/components/solhandle/contacts/contactClient';
const toBase64 = bytes => btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join(''));
const fromBase64 = value => Uint8Array.from(atob(value), char => char.charCodeAt(0));
const message = e => {
  const text = e.response?.data?.error || e.message || 'Please try again.';
  return /requested method and\/or account.*not.*authorized/i.test(text)
    ? 'Your wallet refused signing permission for this account on Solana Mainnet. Open your wallet’s connected-app settings and allow transaction signing for this site and the selected account. No signed payment was submitted by this attempt.'
    : text;
};
export default function Pay({ embedded = false, contactSelection = null, networkRecipient = null, onChooseRecipient }) {
  const { publicKey, signTransaction, signMessage, wallet } = useWallet();
  const location = useLocation();
  const paymentGuard = usePaymentAttempt();
  const params = new URLSearchParams(embedded ? '' : location.search);
  const networkContext = contactSelection ? null : embedded ? networkRecipient : location.state?.networkRecipient || null;
  const incomingContact = contactSelection?.contact || (!embedded && location.state?.contact) || null;
  const incomingContactOwner = contactSelection?.ownerWallet || (!embedded && location.state?.contactOwnerWallet) || '';
  const networkFields = networkContext ? { networkContext } : {};
  const previousNetworkContext = useRef(networkContext);
  const address = publicKey?.toBase58() || '';
  const [selection, setSelection] = useState(null);
  const [asset, setAsset] = useState('SOL'), [usdtLocked, setUsdtLocked] = useState(false);
  const selectedContact = selection?.ownerWallet === address ? selection.contact : null;
  const [handle, setHandle] = useState(() => networkContext?.handle || params.get('handle') || '');
  const [amount, setAmount] = useState(() => params.get('amount') || '');
  const [preview, setPreview] = useState(null), [quote, setQuote] = useState(null), [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(''), [error, setError] = useState(''), [pending, setPending] = useState(null);
  const receiptId = params.get('receipt');
  const requestValue = params.get('request');
  const readableHandle = requestValue?.startsWith('@') ? requestValue.slice(1).toLowerCase() : null;
  const requestId = params.get('link') || (/^[a-f0-9]{24}$/.test(requestValue || '') ? requestValue : null);
  const legacyLink = !requestId && (params.has('handle') || params.has('request'));
  const [linkState, setLinkState] = useState(requestId ? 'loading' : 'none');
  const [requestInfo, setRequestInfo] = useState(null), [linkRevision, setLinkRevision] = useState(0);
  const blockedLink = legacyLink || (requestId && linkState !== 'valid');
  useEffect(() => { if (address && !requestId && !receiptId && !legacyLink) { const saved = readUsdtPending(address, 'USDC') || readUsdtPending(address, 'USDT') || readUsdtPending(address, 'HANDLE'); if (saved) setAsset(saved.asset); } }, [address, requestId, receiptId, legacyLink]);
  const selectContact = contact => { setSelection({ contact, ownerWallet: address }); setHandle(contact.handle); setPreview(null); setQuote(null); setPending(null); setError(''); };
  const clearContact = () => { setSelection(null); setHandle(''); setPreview(null); setQuote(null); setPending(null); setError(''); };
  useEffect(() => {
    setQuote(null); setPending(null); setLoading(''); setError('');
    if (selection && selection.ownerWallet !== address) clearContact();
    if (networkContext && !requestId && !receiptId) { setSelection(null); setHandle(networkContext.handle); }
    else if (previousNetworkContext.current && !networkContext && !incomingContact && !requestId && !receiptId && !legacyLink) setHandle('');
    previousNetworkContext.current = networkContext;
    if (incomingContact && incomingContactOwner === address && !requestId && !receiptId) selectContact(incomingContact);
  }, [location.key, address, incomingContact, incomingContactOwner]);
  useEffect(() => {
    if (!receiptId) { setReceipt(null); setQuote(null); setPending(null); setError(''); }
  }, [receiptId, location.key]);
  useEffect(() => {
    if (!requestId || receiptId) { setLinkState('none'); setRequestInfo(null); return; }
    let alive = true; setLinkState('loading'); setError(''); setPreview(null); setQuote(null); setLoading('link');
    base44.functions.invoke('preparePayTransaction', { action: 'link_status', requestId }).then(res => {
      if (!alive) return;
      if (readableHandle && readableHandle !== res.data.handle) { setLinkState('invalid'); setError('This payment link does not match its @handle. Request a new link.'); return; }
      setHandle(res.data.handle);
      setAsset(res.data.asset || 'SOL');
      if (res.data.fixedAmount || requestInfo?.id !== requestId) setAmount(res.data.amount);
      if (res.data.kind === 'SINGLE_USE' && res.data.status === 'OPEN') setPending(null);
      setRequestInfo({ ...res.data, id: requestId });
      setLinkState(res.data.valid ? 'valid' : 'invalid');
      if (!res.data.valid) setError(res.data.message || 'This payment request is no longer open.');
    }).catch(e => { if (alive) { setLinkState('invalid'); setError(message(e)); } }).finally(() => { if (alive) setLoading(''); });
    return () => { alive = false; };
  }, [requestId, readableHandle, receiptId, linkRevision]);
  useEffect(() => {
    if (requestInfo?.status !== 'PROCESSING' || receiptId || pending) return;
    const timer = setInterval(() => setLinkRevision(value => value + 1), 15000);
    return () => clearInterval(timer);
  }, [requestInfo?.status, receiptId, pending]);
  useEffect(() => {
    if (!receiptId || !publicKey) return;
    let alive = true; setLoading('receipt'); setError('');
    authorizedPayments('receipt', publicKey, signMessage, { id: receiptId }).then(data => { if (alive) setReceipt(data.payment); }).catch(e => { if (alive) setError(message(e)); }).finally(() => { if (alive) setLoading(''); });
    return () => { alive = false; };
  }, [receiptId, publicKey?.toBase58(), signMessage]);
  useEffect(() => {
    setPreview(null); setQuote(null);
    const name = handle.trim().replace(/^@/, '').toLowerCase();
    if (!/^[a-z0-9]{1,20}$/.test(name)) return;
    let alive = true; const timer = setTimeout(() => { setLoading('resolve'); base44.functions.invoke('resolveSolHandle', { handle: name }).then(r => { if (alive) setPreview(r.data); }).catch(e => { if (alive) setError(message(e)); }).finally(() => { if (alive) setLoading(''); }); }, 450);
    return () => { alive = false; clearTimeout(timer); };
  }, [handle, requestId, linkRevision]);
  const pull = usePullToRefresh(async () => {
    const name = handle.trim().replace(/^@/, '').toLowerCase();
    if (!/^[a-z0-9]{1,20}$/.test(name)) return;
    await base44.functions.invoke('resolveSolHandle', { handle: name }).then(res => setPreview(res.data)).catch(error => setError(message(error)));
  }, !loading && !quote && !pending && !receiptId && !blockedLink);
  const lamports = /^\d+(\.\d{1,9})?$/.test(amount) ? Math.round(Number(amount) * 1e9) : 0;
  const review = async () => { if (blockedLink) return; if (!publicKey) return setError('Connect your Solana wallet first.'); if (!selectedContact && !preview?.safeForNativeSol) return setError('This wallet cannot safely receive native SOL.'); if (!Number.isSafeInteger(lamports) || lamports <= 0) return setError('Enter a valid amount, up to 9 decimal places.'); const attempt = paymentGuard.begin(); if (!attempt) return; setLoading('quote'); setError(''); try { const res = await base44.functions.invoke('preparePayTransaction', { action: 'prepare', ...networkFields, handle, senderWallet: publicKey.toBase58(), amountLamports: lamports, ...(requestId ? { requestId } : {}), ...(selectedContact ? { contactId: selectedContact.id, ...contactPaymentProof(publicKey.toBase58()) } : {}) }); attempt.assertCurrent(); setQuote(res.data); } catch (e) { if (!attempt.current()) return; const text = message(e); if (requestId && /changed ownership|payment link is invalid|already been paid|no longer open|has expired|was cancelled|awaiting confirmation|already being processed/i.test(text)) { setLinkState('invalid'); setQuote(null); } setError(text); } finally { if (attempt.current()) setLoading(''); attempt.finish(); } };
  const send = async () => { if (blockedLink) return; if (!quote || !publicKey || !signTransaction) return setError('Connect a wallet capable of signing transactions.'); const attempt = paymentGuard.begin(); if (!attempt) return; setLoading('send'); setError(''); try { const fresh = (await base44.functions.invoke('preparePayTransaction', { action: 'prepare', ...networkFields, handle, senderWallet: publicKey.toBase58(), amountLamports: lamports, ...(requestId ? { requestId } : {}), ...(selectedContact ? { contactId: selectedContact.id, ...contactPaymentProof(publicKey.toBase58()) } : {}) })).data; attempt.assertCurrent(); if (fresh.destinationAddress !== quote.destinationAddress || fresh.displayHandle !== quote.displayHandle || Boolean(fresh.savedContact) !== Boolean(quote.savedContact) || Boolean(fresh.handleChanged) !== Boolean(quote.handleChanged)) { setQuote(fresh); setError('The recipient or handle ownership status changed. Review the updated payment before signing.'); return; } setQuote(fresh); const unsigned = Transaction.from(fromBase64(fresh.serializedTransaction)); const signed = await signPayTransaction(unsigned, wallet, publicKey, signTransaction); attempt.assertCurrent(); const res = await base44.functions.invoke('preparePayTransaction', { action: 'submit', ...networkFields, handle, senderWallet: publicKey.toBase58(), amountLamports: lamports, ...(requestId ? { requestId } : {}), ...(selectedContact ? { contactId: selectedContact.id, ...contactPaymentProof(publicKey.toBase58()) } : {}), signedTransaction: toBase64(signed.serialize()) }); attempt.assertCurrent(); if (res.data.pending) { setPending({ ...networkFields, signature: res.data.signature, handle, amountLamports: lamports, senderWallet: publicKey.toBase58(), ...(requestId ? { requestId } : {}), ...(selectedContact ? { contactId: selectedContact.id, ...contactPaymentProof(publicKey.toBase58()) } : {}), signedTransaction: toBase64(signed.serialize()) }); setError(res.data.error); } else { setReceipt(res.data.payment); if (!embedded) window.history.replaceState(null, '', `/pay?receipt=${encodeURIComponent(res.data.payment.id)}`); setQuote(null); } } catch (e) { if (!attempt.current()) return; const text = message(e); if (/blockhash not found/i.test(text)) { setQuote(null); setError('The transaction expired before it could be sent. No payment was sent. Review the payment again.'); } else { if (requestId && /changed ownership|payment link is invalid|already been paid|no longer open|has expired|was cancelled|awaiting confirmation|already being processed/i.test(text)) { setLinkState('invalid'); setQuote(null); } setError(text); } } finally { if (attempt.current()) setLoading(''); attempt.finish(); } };
  const recover = async () => { if (!pending) return; setLoading('send'); setError(''); try { const res = await base44.functions.invoke('preparePayTransaction', { ...pending, ...(pending.contactId ? contactPaymentProof(pending.senderWallet) : {}), action: pending.requestId ? 'recover' : pending.signedTransaction ? 'submit' : 'recover' }); if (res.data.pending) setError(res.data.error); else { setReceipt(res.data.payment); if (!embedded) window.history.replaceState(null, '', `/pay?receipt=${encodeURIComponent(res.data.payment.id)}`); setPending(null); setQuote(null); } } catch (e) { setError(/blockhash not found|expired/i.test(message(e)) ? 'This signature has not been confirmed yet. Check Explorer before preparing a new payment; do not sign twice unless you are sure the first transfer failed.' : message(e)); } finally { setLoading(''); } };
  return <main ref={pull.ref} data-mobile-scroll-panel className={embedded ? 'network-embedded-pay' : 'min-h-screen bg-[#050811] text-white'}><PullRefreshStatus refreshing={pull.refreshing} distance={pull.distance} ready={pull.ready}/><div className="mx-auto min-h-screen max-w-7xl border-x border-white/10">{!embedded && <Header/>}<section className="mx-auto max-w-2xl px-5 py-8 sm:py-10"><PayMascotHeading/><NetworkPayContextNotice context={networkContext} onChooseRecipient={onChooseRecipient}/><p className="mt-3 text-sm leading-relaxed text-slate-400">Enter an @handle and an amount. Check the linked wallet address, then confirm the payment in your wallet. Direct from your wallet, with no custody or SolHandle fee.</p>{blockedLink && !receiptId && !receipt && <div role="alert" className="mt-6 rounded-xl border border-rose-400/40 bg-rose-400/10 p-4 text-sm text-rose-100">{legacyLink ? 'This older payment link cannot verify its original recipient. For your safety, request a new payment link.' : linkState === 'loading' ? 'Checking this payment link and its original recipient…' : requestInfo?.message || 'This payment link cannot be used. Request a new link from the recipient.'} {(legacyLink || requestInfo?.status === 'INVALID') && <Link to="/pay" className="font-semibold underline">Send to the current @handle instead</Link>}</div>}<div className="mt-9 space-y-5">{!requestId && !receiptId && !receipt && !blockedLink && <PayAssetSelect value={asset} disabled={Boolean(quote || pending || loading || usdtLocked)} onChange={value => { setAsset(value); setError(''); }}/>} {requestId && !receipt && !receiptId && <PayRequestNotice request={requestInfo} checking={Boolean(loading)} onRefresh={() => setLinkRevision(value => value + 1)}/>} {receipt ? <PaymentReceipt payment={receipt}/> : receiptId ? <div className="card-glow">{loading ? 'Loading private receipt…' : 'Connect and sign with the sender or recipient wallet to view this receipt.'}</div> : ['USDC', 'USDT', 'HANDLE'].includes(asset) && (!blockedLink || Boolean(requestId && requestInfo)) ? <UsdtPayment networkContext={networkContext} key={`${asset}:${requestId || 'direct'}`} asset={asset} handle={handle} requestId={requestId} request={requestInfo} blocked={Boolean(blockedLink)} contact={selectedContact} onSelectContact={selectContact} onClearContact={clearContact} onHandleChange={value => { setHandle(value); setError(''); }} preview={preview} resolving={loading === 'resolve'} onLockChange={setUsdtLocked} onComplete={payment => { setReceipt(payment); if (!embedded) window.history.replaceState(null, '', `/pay?receipt=${encodeURIComponent(payment.id)}`); }}/> : <div className="card-glow space-y-5">{!networkContext && !requestId && !quote && !pending && <ContactPicker key={address} onSelect={selectContact}/>}{selectedContact && <ContactRecipientNotice contact={selectedContact} preview={preview} disabled={!!loading || !!pending} onClear={clearContact}/>}<div><label htmlFor="pay-handle" className="text-sm font-medium text-slate-200">Recipient @handle</label><input id="pay-handle" value={handle} readOnly={!!networkContext || !!requestId || !!selectedContact} onChange={e => { setSelection(null); setHandle(e.target.value); setPreview(null); setQuote(null); setError(''); setPending(null); }} placeholder="@ansem" autoComplete="off" className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900 px-4 py-3 text-lg text-white outline-none placeholder:text-slate-600 focus:border-cyan-300"/>{handle.trim() && !/^[a-z0-9]{1,20}$/.test(handle.trim().replace(/^@/, '').toLowerCase()) && <p className="mt-2 text-xs text-rose-300">Use 1–20 letters or numbers after @.</p>}{loading === 'resolve' && <p className="mt-2 text-xs text-cyan-300">Verifying on Solana…</p>}</div>{preview && !blockedLink && !selectedContact && <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-4"><p className="font-semibold text-cyan-200">{preview.handle} <span className="text-xs text-emerald-300">✓ Verified on-chain</span></p><p className="mt-2 break-all font-mono text-xs text-slate-300">{preview.address}</p><p className={`mt-2 text-xs ${preview.safeForNativeSol ? 'text-emerald-300' : 'text-rose-300'}`}>{preview.safeForNativeSol ? 'Can receive native SOL' : 'Unsafe native SOL destination — payment blocked'}</p></div>}<div><label htmlFor="pay-amount" className="text-sm font-medium text-slate-200">Amount (SOL)</label><input id="pay-amount" value={amount} readOnly={Boolean(requestId && requestInfo?.fixedAmount)} aria-readonly={Boolean(requestId && requestInfo?.fixedAmount)} onChange={e => { setAmount(e.target.value); setQuote(null); setPending(null); }} inputMode="decimal" placeholder="0.00" className="mt-2 w-full rounded-xl border border-white/15 bg-slate-900 px-4 py-3 text-lg text-white outline-none placeholder:text-slate-600 focus:border-cyan-300"/></div>{!publicKey && <p className="text-sm text-amber-200">Connect your wallet above to send.</p>}{quote ? <SolPayReview quote={quote} amountLamports={lamports} busy={!!loading || !!pending || !!blockedLink} onSend={send} onEdit={() => { setQuote(null); setError(''); }}/> : <button type="button" onClick={review} disabled={!!loading || (!selectedContact && !preview?.safeForNativeSol) || !publicKey || !!blockedLink} className="w-full rounded-xl bg-gradient-to-r from-cyan-300 to-violet-400 px-5 py-3 font-semibold text-slate-950 disabled:opacity-50">{loading === 'quote' ? 'Preparing payment…' : 'Review payment'}</button>}</div>}{pending && <SolPayPending pending={pending} busy={!!loading} onRecover={recover}/>}{error && <div role="alert" className="rounded-xl border border-rose-400/40 bg-rose-400/10 p-4 text-sm text-rose-100">{error}{pending ? null : receiptId ? <button type="button" onClick={() => window.location.reload()} className="ml-2 underline">Retry</button> : quote ? <button type="button" onClick={() => { setQuote(null); setError(''); }} className="ml-2 underline">Review payment again</button> : null}</div>}{!embedded && <Link to="/my-handles" className="inline-block text-sm text-slate-400 hover:text-white">← My Handles</Link>}</div></section></div></main>;
}