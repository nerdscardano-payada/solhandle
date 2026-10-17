import { rpc } from './solanaRpc.ts';
import { resolveOnChain } from './solhandleResolver.ts';
import { confirmedRequestMatches, linkStatus, requestError } from './payRequestRules.ts';
import { saveConfirmedPayment } from './payConfirmation.ts';
import confirmedTokenPayment from './tokenPayConfirmation.ts';
export async function refreshPayLink(base44, rpcUrl, link, verifyOwner = true) {
  const client = base44.asServiceRole;
  if (link.status === 'PROCESSING' && link.processing_signature) {
    const tokenRequest = link.asset && link.asset !== 'SOL';
    const details = await rpc(rpcUrl, 'getTransaction', [link.processing_signature, { encoding: tokenRequest ? 'base64' : 'jsonParsed', commitment: 'confirmed', maxSupportedTransactionVersion: 0 }]);
    if (details && !details.meta?.err && tokenRequest) {
      const context = { asset: link.asset, handle: link.handle, sender: link.processing_sender, recipient: link.recipient_wallet_at_creation, amountRaw: link.processing_amount_raw, lastValidBlockHeight: link.processing_last_valid_height, requestId: link.id };
      await confirmedTokenPayment(base44, rpcUrl, link.processing_signature, context, details, link);
      return await client.entities.PayLink.get(link.id);
    }
    if (details && !details.meta?.err) {
      const keys = details.transaction?.message?.accountKeys || [];
      const transfers = (details.transaction?.message?.instructions || []).filter(ix => ix.program === 'system');
      const info = transfers[0]?.parsed?.info;
      if (transfers.length !== 1 || transfers[0]?.parsed?.type !== 'transfer' || keys[0]?.pubkey !== link.processing_sender || !keys[0]?.signer || info?.source !== link.processing_sender || info?.destination !== link.recipient_wallet_at_creation || info?.lamports !== link.processing_amount_lamports || !confirmedRequestMatches(details, link)) throw requestError('Pending payment does not match this request.');
      await saveConfirmedPayment(base44, rpcUrl, link.processing_signature, link.handle, info.source, info.destination, info.lamports, link);
      return await client.entities.PayLink.get(link.id);
    }
    const statuses = await rpc(rpcUrl, 'getSignatureStatuses', [[link.processing_signature], { searchTransactionHistory: true }]);
    const signatureStatus = statuses?.value?.[0];
    const blockhash = !details && !signatureStatus ? await rpc(rpcUrl, 'isBlockhashValid', [link.processing_blockhash, { commitment: 'finalized' }]) : null;
    if (details?.meta?.err || signatureStatus?.err || (!signatureStatus && blockhash?.value === false)) {
      await client.entities.PayLink.updateMany({ id: link.id, status: 'PROCESSING', processing_signature: link.processing_signature }, { $set: { status: 'OPEN', processing_signature: '', processing_sender: '', processing_blockhash: '', processing_amount_lamports: 0, processing_amount_raw: '', processing_last_valid_height: 0 } });
      link = await client.entities.PayLink.get(link.id);
    } else return link;
  }
  if ((link.status || 'OPEN') !== 'OPEN') return link;
  let status = linkStatus(link);
  if (status === 'OPEN' && verifyOwner) {
    const owner = await resolveOnChain(rpcUrl, link.handle);
    if (!owner?.safeForNativeSol || owner.address !== link.recipient_wallet_at_creation) status = 'INVALID';
  }
  if (status !== 'OPEN') {
    await client.entities.PayLink.updateMany({ id: link.id, $or: [{ status: 'OPEN' }, { status: null }, { status: { $exists: false } }] }, { $set: { status } });
    return await client.entities.PayLink.get(link.id);
  }
  return link;
}
export async function claimPayLink(client, link, tx, signature, sender, amount, tokenContext = null) {
  if (link.kind !== 'SINGLE_USE') return;
  if (link.status === 'PROCESSING' && link.processing_signature === signature) return;
  const result = await client.entities.PayLink.updateMany({ id: link.id, status: 'OPEN', $or: [{ expires_at: '' }, { expires_at: { $exists: false } }, { expires_at: { $gt: new Date().toISOString() } }] }, { $set: { status: 'PROCESSING', processing_signature: signature, processing_sender: sender, processing_amount_lamports: amount, processing_blockhash: tx.recentBlockhash, processing_amount_raw: tokenContext?.amountRaw || '', processing_last_valid_height: tokenContext?.lastValidBlockHeight || 0 } });
  if (result.updated !== 1) throw requestError('This request is no longer open or another payment is already being processed. Refresh the request before continuing.');
}