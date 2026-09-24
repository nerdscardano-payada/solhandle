import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';
import { PublicKey, SystemInstruction, SystemProgram, Transaction } from 'npm:@solana/web3.js@1.98.4';
import { secrets } from 'base44:runtime';
import { resolveOnChain, reverseOnChain, normalizeHandle } from '../../shared/solhandleResolver.ts';
import { rpc } from '../../shared/solanaRpc.ts';

function bytes64(bytes) { return btoa(Array.from(bytes, b => String.fromCharCode(b)).join('')); }
function decode64(value) { return Uint8Array.from(atob(value), c => c.charCodeAt(0)); }
function fail(message, status = 400) { return Response.json({ error: message }, { status }); }
async function saveConfirmed(base44, rpcUrl, signature, handle, sender, receiver, amount) {
  const previous = await base44.asServiceRole.entities.Payment.filter({ tx_signature: signature }, '-created_at', 1);
  if (previous.length) return previous[0];
  let primary = '';
  try { primary = (await reverseOnChain(rpcUrl, sender))?.primaryHandle || ''; } catch { /* A missing primary must not block a confirmed transfer. */ }
  return await base44.asServiceRole.entities.Payment.create({ handle: `@${handle}`, receiver_wallet: receiver, sender_wallet: sender, sender_primary_handle: primary, amount_lamports: amount, tx_signature: signature, status: 'CONFIRMED', created_at: new Date().toISOString(), confirmed_at: new Date().toISOString() });
}
export default async function(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const base44 = createClientFromRequest(req);
    const rpcUrl = secrets.get('SOLANA_RPC_URL');
    const handle = normalizeHandle(body.handle);
    if (!/^[a-z0-9]{1,20}$/.test(handle)) return fail('Enter a valid @handle (1–20 letters or numbers).');
    const sender = new PublicKey(String(body.senderWallet || '')).toBase58();
    const amount = Number(body.amountLamports);
    if (!Number.isSafeInteger(amount) || amount <= 0) return fail('Enter a valid SOL amount.');
    if (body.action === 'prepare') {
      const resolved = await resolveOnChain(rpcUrl, handle);
      if (!resolved) return fail('Handle not found.', 404);
      if (!resolved.safeForNativeSol) return fail('This address cannot safely receive native SOL. Do not send.');
      if (resolved.address === sender) return fail('You cannot send SOL to your own wallet.');
      const latest = await rpc(rpcUrl, 'getLatestBlockhash', [{ commitment: 'confirmed' }]);
      const tx = new Transaction({ feePayer: new PublicKey(sender), recentBlockhash: latest.value.blockhash }).add(SystemProgram.transfer({ fromPubkey: new PublicKey(sender), toPubkey: new PublicKey(resolved.address), lamports: amount }));
      const fee = await rpc(rpcUrl, 'getFeeForMessage', [bytes64(tx.serializeMessage()), { commitment: 'confirmed' }]);
      const networkFeeEstimate = Number(fee?.value);
      if (!Number.isFinite(networkFeeEstimate)) return fail('Network fee unavailable. Try again.', 503);
      const balance = await rpc(rpcUrl, 'getBalance', [sender, { commitment: 'confirmed' }]);
      if (Number(balance?.value || 0) < amount + networkFeeEstimate) return fail('Insufficient SOL for the amount and network fee.', 422);
      return Response.json({ serializedTransaction: bytes64(tx.serialize({ requireAllSignatures: false, verifySignatures: false })), destinationAddress: resolved.address, displayHandle: resolved.handle, networkFeeEstimate });
    }
    if (body.action !== 'submit' && body.action !== 'recover') return fail('Unsupported action.');
    let signature = String(body.signature || '');
    if (body.action === 'submit') {
      if (typeof body.signedTransaction !== 'string' || body.signedTransaction.length > 3000) return fail('Signed transaction required.');
      const tx = Transaction.from(decode64(body.signedTransaction));
      if (!tx.verifySignatures() || tx.instructions.length !== 1 || !tx.instructions[0].programId.equals(SystemProgram.programId) || tx.feePayer?.toBase58() !== sender) return fail('Invalid signed SOL transfer.');
      const transfer = SystemInstruction.decodeTransfer(tx.instructions[0]);
      if (transfer.fromPubkey.toBase58() !== sender || transfer.lamports !== amount) return fail('Signed amount or sender changed.');
      const resolved = await resolveOnChain(rpcUrl, handle);
      if (!resolved || !resolved.safeForNativeSol || transfer.toPubkey.toBase58() !== resolved.address) return fail('The handle owner or recipient changed. Review the payment again before signing.', 409);
      signature = await rpc(rpcUrl, 'sendTransaction', [body.signedTransaction, { encoding: 'base64', preflightCommitment: 'confirmed' }]);
    }
    if (!/^[1-9A-HJ-NP-Za-km-z]{64,90}$/.test(signature)) return fail('Invalid transaction signature.');
    for (let attempt = 0; attempt < 18; attempt++) {
      const details = await rpc(rpcUrl, 'getTransaction', [signature, { encoding: 'jsonParsed', commitment: 'confirmed', maxSupportedTransactionVersion: 0 }]);
      if (details) {
        if (details.meta?.err) return fail('Solana rejected the transaction. Check your wallet before retrying.', 422);
        const keys = details.transaction?.message?.accountKeys || [];
        const instructions = details.transaction?.message?.instructions || [];
        const ix = instructions[0];
        const info = ix?.parsed?.info;
        if (instructions.length !== 1 || ix.program !== 'system' || ix.parsed?.type !== 'transfer' || !keys[0]?.signer || keys[0]?.pubkey !== sender || info?.source !== sender || info?.lamports !== amount) return fail('Transaction does not match this payment.', 403);
        const resolved = await resolveOnChain(rpcUrl, handle);
        if (!resolved || info.destination !== resolved.address) return fail('The handle owner changed before this payment could be recorded. Your transfer is on-chain; check Explorer.', 409);
        const payment = await saveConfirmed(base44, rpcUrl, signature, handle, sender, info.destination, amount);
        return Response.json({ signature, payment });
      }
      if (attempt < 17) await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return Response.json({ signature, pending: true, error: 'Confirmation is taking longer than expected. Check Explorer before retrying.' }, { status: 202 });
  } catch (error) { return Response.json({ error: error.message || 'Payment could not be completed.' }, { status: 500 }); }
}