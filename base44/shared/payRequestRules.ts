import { PublicKey } from 'npm:@solana/web3.js@1.98.4';
export const PAY_MEMO = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr';
export const requestMemo = id => `SolHandle Pay request:${id}`;
export const requestError = (message, status = 409) => Object.assign(new Error(message), { status });
export function solLamports(value) {
  const text = String(value || '');
  if (!/^\d+(\.\d{1,9})?$/.test(text)) throw requestError('Enter a positive SOL amount with up to 9 decimal places.', 400);
  const [whole, fraction = ''] = text.split('.');
  const raw = BigInt(whole) * 1000000000n + BigInt(fraction.padEnd(9, '0'));
  if (raw <= 0n || raw > BigInt(Number.MAX_SAFE_INTEGER)) throw requestError('Invalid SOL amount.', 400);
  return Number(raw);
}
export async function findPayLink(client, id) {
  if (typeof id !== 'string' || !/^[a-f0-9]{24}$/.test(id)) throw requestError('Invalid payment link.', 400);
  const { items } = await client.entities.PayLink.filter({ id }, { limit: 1 });
  if (!items[0]) throw requestError('This payment link was not found.', 404);
  return items[0];
}
export const linkStatus = link => link.status === 'PROCESSING' || link.status === 'PAID' || link.status === 'CANCELLED' || link.status === 'INVALID' ? link.status : link.expires_at && Date.parse(link.expires_at) <= Date.now() ? 'EXPIRED' : link.status || 'OPEN';
export const statusMessage = status => ({ PROCESSING: 'This request has a payment awaiting confirmation. Do not pay again.', PAID: 'This payment request has already been paid.', CANCELLED: 'This payment request was cancelled by its creator.', EXPIRED: 'This payment request has expired.', INVALID: 'This @handle has changed ownership. Request a new payment link.' }[status] || 'This payment request is not open.');
export function assertPayLink(link, amount, recoverySignature = '') {
  if (!link) return;
  const status = linkStatus(link);
  const ownAttempt = recoverySignature && link.processing_signature === recoverySignature && ['PROCESSING', 'PAID'].includes(status);
  if (status !== 'OPEN' && !ownAttempt) throw requestError(statusMessage(status));
  if (link.kind === 'SINGLE_USE' && solLamports(link.requested_amount_sol) !== amount) throw requestError('The amount must match the fixed amount on this payment request.', 400);
}
export function transactionHasRequest(tx, link) {
  const references = tx.instructions.filter(ix => ix.programId.equals(new PublicKey(PAY_MEMO))).map(ix => new TextDecoder().decode(ix.data)).filter(text => text.startsWith('SolHandle Pay request:'));
  return references.length === 1 && references[0] === requestMemo(link.id);
}
export function confirmedRequestMatches(details, link) {
  const instructions = details.transaction?.message?.instructions || [];
  const references = instructions.filter(ix => String(ix.programId) === PAY_MEMO && typeof ix.parsed === 'string' && ix.parsed.startsWith('SolHandle Pay request:'));
  return references.length === 1 && references[0].parsed === requestMemo(link.id);
}