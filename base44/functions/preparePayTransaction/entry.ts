import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';
import { ComputeBudgetProgram, PublicKey, SystemInstruction, SystemProgram, Transaction } from 'npm:@solana/web3.js@1.98.4';
import { secrets } from 'base44:runtime';
import { resolveOnChain, reverseOnChain, normalizeHandle } from '../../shared/solhandleResolver.ts';
import { rpc } from '../../shared/solanaRpc.ts';
import { resolveContactPayment } from '../../shared/contactPayment.ts';
import { Buffer } from 'node:buffer';
import bs58 from 'npm:bs58@6.0.0';
import { PAY_MEMO, requestMemo, findPayLink, linkStatus, statusMessage, assertPayLink, transactionHasRequest, confirmedRequestMatches } from '../../shared/payRequestRules.ts';
import { refreshPayLink, claimPayLink } from '../../shared/payRequestLifecycle.ts';
import { saveConfirmedPayment } from '../../shared/payConfirmation.ts';
import { handleUsdtPayment } from '../../shared/usdtPayFlow.ts';

function bytes64(bytes) { return btoa(Array.from(bytes, b => String.fromCharCode(b)).join('')); }
function decode64(value) { return Uint8Array.from(atob(value), c => c.charCodeAt(0)); }
function fail(message, status = 400) { return Response.json({ error: message }, { status }); }
const MEMO_PROGRAMS = new Set(['MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr', 'Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo']);
const LIGHTHOUSE_PROGRAM = 'L2TExMFKdjpN9kozasaurPirfHy9P8sbXoAN1qA3S95';
const isAllowedProgram = id => id === SystemProgram.programId.toBase58() || id === ComputeBudgetProgram.programId.toBase58() || id === LIGHTHOUSE_PROGRAM || MEMO_PROGRAMS.has(id);
export default async function(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const base44 = createClientFromRequest(req);
    const rpcUrl = secrets.get('SOLANA_RPC_URL');
    if (body.asset != null && body.asset !== 'SOL' && body.asset !== 'USDT') return fail('Unsupported payment currency.');
    if (body.asset === 'USDT') return await handleUsdtPayment(base44, rpcUrl, body);
    if (body.action === 'link_status') {
      const link = await refreshPayLink(base44, rpcUrl, await findPayLink(base44.asServiceRole, body.requestId));
      const status = linkStatus(link);
      return Response.json({ handle: link.handle, amount: link.requested_amount_sol || '', valid: status === 'OPEN', status, kind: link.kind || 'REUSABLE', fixedAmount: link.kind === 'SINGLE_USE', description: link.description || '', expiresAt: link.expires_at || '', message: status === 'OPEN' ? '' : statusMessage(status) });
    }
    const handle = normalizeHandle(body.handle);
    if (!/^[a-z0-9]{1,20}$/.test(handle)) return fail('Enter a valid @handle (1–20 letters or numbers).');
    const sender = new PublicKey(String(body.senderWallet || '')).toBase58();
    const amount = Number(body.amountLamports);
    if (!Number.isSafeInteger(amount) || amount <= 0) return fail('Enter a valid SOL amount.');
    if (body.contactId && body.requestId) return fail('Choose either a saved contact or a payment link, not both.');
    const recipient = () => body.contactId ? resolveContactPayment(base44.asServiceRole, rpcUrl, body, handle, sender) : resolveOnChain(rpcUrl, handle);
    let link = null;
    if (body.requestId != null) {
      if (typeof body.requestId !== 'string' || !/^[a-f0-9]{24}$/.test(body.requestId)) return fail('Invalid payment link.');
      const rows = await base44.asServiceRole.entities.PayLink.filter({ id: body.requestId }, '-created_date', 1);
      link = rows[0];
      if (!link || link.handle !== handle) return fail('This payment link is invalid. Request a new link.', 409);
    }
    if (body.action === 'prepare') {
      if (link) link = await refreshPayLink(base44, rpcUrl, link, false);
      assertPayLink(link, amount);
      const resolved = await recipient();
      if (link && resolved?.address !== link.recipient_wallet_at_creation) return fail('This @handle has changed ownership since this payment link was created. For your safety, this link can no longer be used.', 409);
      if (!resolved) return fail('Handle not found.', 404);
      if (!resolved.safeForNativeSol) return fail('This address cannot safely receive native SOL. Do not send.');
      if (resolved.address === sender) return fail('You cannot send SOL to your own wallet.');
      const latest = await rpc(rpcUrl, 'getLatestBlockhash', [{ commitment: 'confirmed' }]);
      const tx = new Transaction({ feePayer: new PublicKey(sender), recentBlockhash: latest.value.blockhash }).add(
        ComputeBudgetProgram.setComputeUnitLimit({ units: 200000 }),
        ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 0 }),
        SystemProgram.transfer({ fromPubkey: new PublicKey(sender), toPubkey: new PublicKey(resolved.address), lamports: amount })
      );
      if (link) tx.add({ keys: [], programId: new PublicKey(PAY_MEMO), data: Buffer.from(requestMemo(link.id)) });
      const fee = await rpc(rpcUrl, 'getFeeForMessage', [bytes64(tx.serializeMessage()), { commitment: 'confirmed' }]);
      const networkFeeEstimate = Number(fee?.value);
      if (!Number.isFinite(networkFeeEstimate)) return fail('Network fee unavailable. Try again.', 503);
      const balance = await rpc(rpcUrl, 'getBalance', [sender, { commitment: 'confirmed' }]);
      if (Number(balance?.value || 0) < amount + networkFeeEstimate) return fail('Insufficient SOL for the amount and network fee.', 422);
      return Response.json({ serializedTransaction: bytes64(tx.serialize({ requireAllSignatures: false, verifySignatures: false })), destinationAddress: resolved.address, displayHandle: resolved.handle, networkFeeEstimate, savedContact: !!resolved.savedContact, handleChanged: !!resolved.handleChanged });
    }
    if (body.action !== 'submit' && body.action !== 'recover') return fail('Unsupported action.');
    let signature = String(body.signature || '');
    if (body.action === 'submit') {
      if (typeof body.signedTransaction !== 'string' || body.signedTransaction.length > 3000) return fail('Signed transaction required.');
      const tx = Transaction.from(decode64(body.signedTransaction));
      if (tx.feePayer?.toBase58() !== sender) return fail('Your wallet switched accounts while signing. Reconnect the correct wallet and review again.');
      if (!tx.verifySignatures()) return fail('The wallet did not return a valid signature for this transfer. Reconnect your wallet and review again.');
      signature = bs58.encode(tx.signature);
      if (link) {
        assertPayLink(link, amount, signature);
        if (!transactionHasRequest(tx, link)) return fail('Signed transaction is missing this payment request reference.', 403);
      }
      const transfers = tx.instructions.filter(ix => ix.programId.equals(SystemProgram.programId));
      const unexpectedPrograms = [...new Set(tx.instructions.map(ix => ix.programId.toBase58()).filter(id => !isAllowedProgram(id)))];
      if (transfers.length !== 1 || unexpectedPrograms.length) return fail(`Your wallet added unsupported payment instructions (${transfers.length} transfers${unexpectedPrograms.length ? `; programs: ${unexpectedPrograms.join(', ')}` : ''}). No payment was sent.`, 422);
      const transfer = SystemInstruction.decodeTransfer(transfers[0]);
      const fee = await rpc(rpcUrl, 'getFeeForMessage', [bytes64(tx.serializeMessage()), { commitment: 'confirmed' }]);
      if (!Number.isFinite(Number(fee?.value)) || Number(fee.value) > 105000) return fail('The network fee changed too much. Review the payment again.');
      if (transfer.fromPubkey.toBase58() !== sender || transfer.lamports !== BigInt(amount)) return fail('Signed amount or sender changed.');
      const resolved = await recipient();
      if (link && resolved?.address !== link.recipient_wallet_at_creation) return fail('This @handle has changed ownership since this payment link was created. For your safety, this link can no longer be used.', 409);
      if (!resolved || !resolved.safeForNativeSol || transfer.toPubkey.toBase58() !== resolved.address) return fail('The handle owner or recipient changed. Review the payment again before signing.', 409);
      if (link) await claimPayLink(base44.asServiceRole, link, tx, signature, sender, amount);
      try { signature = await rpc(rpcUrl, 'sendTransaction', [body.signedTransaction, { encoding: 'base64', preflightCommitment: 'confirmed' }]); }
      catch (error) {
        if (link?.kind === 'SINGLE_USE') return Response.json({ signature, pending: true, error: 'This request is reserved for your signed payment. Check confirmation before trying again.' }, { status: 202 });
        throw error;
      }
    } else if (link?.kind === 'SINGLE_USE') {
      assertPayLink(link, amount, signature);
      if (link.processing_signature !== signature || link.processing_sender !== sender) return fail('This signature does not match the payment being processed for this request.', 403);
    }
    if (!/^[1-9A-HJ-NP-Za-km-z]{64,90}$/.test(signature)) return fail('Invalid transaction signature.');
    for (let attempt = 0; attempt < 18; attempt++) {
      const details = await rpc(rpcUrl, 'getTransaction', [signature, { encoding: 'jsonParsed', commitment: 'confirmed', maxSupportedTransactionVersion: 0 }]);
      if (details) {
        if (details.meta?.err) return fail('Solana rejected the transaction. Check your wallet before retrying.', 422);
        const keys = details.transaction?.message?.accountKeys || [];
        const instructions = details.transaction?.message?.instructions || [];
        const transfers = instructions.filter(ix => ix.program === 'system');
                 const ix = transfers[0];
                 const info = ix?.parsed?.info;
                 if (transfers.length !== 1 || instructions.some(ix => !isAllowedProgram(ix.programId)) || ix.parsed?.type !== 'transfer' || !keys[0]?.signer || keys[0]?.pubkey !== sender || info?.source !== sender || info?.lamports !== amount) return fail('Transaction does not match this payment.', 403);
        const resolved = await recipient();
        if (link ? info.destination !== link.recipient_wallet_at_creation : (!resolved || info.destination !== resolved.address)) return fail('The handle owner changed before this payment could be recorded. Your transfer is on-chain; check Explorer.', 409);
        if (link?.kind && !confirmedRequestMatches(details, link)) return fail('Transaction does not contain this payment request reference.', 403);
        const trackedLink = link && confirmedRequestMatches(details, link) ? link : null;
        const payment = await saveConfirmedPayment(base44, rpcUrl, signature, handle, sender, info.destination, amount, trackedLink);
        return Response.json({ signature, payment });
      }
      // Re-broadcasting the identical signed bytes cannot create a second transfer.
      // Some RPC nodes acknowledge a transaction without forwarding it to a leader.
      if (body.action === 'submit' && (attempt === 4 || attempt === 9 || attempt === 14)) {
        try { await rpc(rpcUrl, 'sendTransaction', [body.signedTransaction, { encoding: 'base64', preflightCommitment: 'confirmed' }]); }
        catch (error) { if (!/blockhash not found|already processed/i.test(error.message || '')) throw error; }
      }
      if (attempt < 17) await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return Response.json({ signature, pending: true, error: 'Still awaiting on-chain confirmation. Check this signature on Explorer before signing a new payment.' }, { status: 202 });
  } catch (error) {
    if (/blockhash not found/i.test(error.message || '')) return fail('The blockhash expired. If this transaction was submitted earlier, check its signature on Explorer before signing a new payment.', 409);
    return Response.json({ error: error.message || 'Payment could not be completed.' }, { status: error.status || 500 });
  }
}