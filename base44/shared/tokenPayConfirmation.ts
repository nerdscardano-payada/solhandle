import bs58 from 'npm:bs58@6.0.0';
import { reverseOnChain } from './solhandleResolver.ts';
import { payError, validateUsdtSigned, verifyUsdtBalances } from './usdtPayTransaction.ts';
import getPayToken from './payAssets.ts';
import { matchTokenPayRequest } from './payRequestAmounts.ts';
export default async function confirmedTokenPayment(base44, rpcUrl, signature, context, details, link = null) {
  const token = getPayToken(context.asset), client = base44.asServiceRole;
  if (details.meta?.err) return { signature, failed: true, error: `Solana rejected this ${token.asset} payment. No ${token.asset} was transferred; a network fee may have been charged.` };
  const chainTx = validateUsdtSigned(details.transaction[0], context);
  if (bs58.encode(chainTx.signature) !== signature) throw payError('On-chain signature mismatch.', 403);
  verifyUsdtBalances(details, context);
  matchTokenPayRequest(link, context);
  if (link?.kind === 'SINGLE_USE' && (link.processing_signature !== signature || !['PROCESSING', 'PAID'].includes(link.status))) throw payError('This signature does not match the payment reserved for this request.', 409);
  const existing = await client.entities.Payment.filter({ tx_signature: signature }, { limit: 1 });
  let payment = existing.items[0];
  if (payment && (payment.asset !== token.asset || payment.token_mint !== token.mint || payment.amount_raw !== context.amountRaw || payment.sender_wallet !== context.sender || payment.receiver_wallet !== context.recipient || payment.handle !== `@${context.handle}` || (payment.request_id && payment.request_id !== link?.id))) throw payError('This signature is already recorded for a different payment.', 409);
  if (!payment) {
    let primary = '';
    try { primary = (await reverseOnChain(rpcUrl, context.sender))?.primaryHandle || ''; } catch { /* Optional display only. */ }
    const time = details.blockTime ? new Date(details.blockTime * 1000).toISOString() : new Date().toISOString();
    const saved = await client.entities.Payment.upsert([{ handle: `@${context.handle}`, receiver_wallet: context.recipient, sender_wallet: context.sender, sender_primary_handle: primary, asset: token.asset, token_mint: token.mint, token_decimals: token.decimals, amount_raw: context.amountRaw, amount_tokens: Number(context.amountRaw) / 10 ** token.decimals, tx_signature: signature, status: 'CONFIRMED', created_at: time, confirmed_at: time, ...(link ? { request_id: link.id, request_description: link.description || '' } : {}) }], { key: 'tx_signature' });
    payment = saved.records[0];
  } else if (link && !payment.request_id) {
    payment = await client.entities.Payment.update(payment.id, { request_id: link.id, request_description: link.description || '' });
  }
  if (link?.kind === 'SINGLE_USE') await client.entities.PayLink.updateMany({ id: link.id, status: 'PROCESSING', processing_signature: signature }, { $set: { status: 'PAID', paid_at: payment.confirmed_at, payment_id: payment.id } });
  return { signature, payment };
}