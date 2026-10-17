import { reverseOnChain } from './solhandleResolver.ts';
import { requestError } from './payRequestRules.ts';
export async function saveConfirmedPayment(base44, rpcUrl, signature, handle, sender, receiver, amount, link = null) {
  const client = base44.asServiceRole;
  const { items } = await client.entities.Payment.filter({ tx_signature: signature }, { limit: 1 });
  let payment = items[0];
  if (payment && link && payment.request_id && payment.request_id !== link.id) throw requestError('This transaction belongs to another request.');
  if (!payment) {
    let primary = '';
    try { primary = (await reverseOnChain(rpcUrl, sender))?.primaryHandle || ''; } catch { /* Optional display name only. */ }
    payment = await client.entities.Payment.create({ handle: `@${handle}`, receiver_wallet: receiver, sender_wallet: sender, sender_primary_handle: primary, amount_lamports: amount, tx_signature: signature, status: 'CONFIRMED', created_at: new Date().toISOString(), confirmed_at: new Date().toISOString(), ...(link ? { request_id: link.id, request_description: link.description || '' } : {}) });
  } else if (link && !payment.request_id) {
    payment = await client.entities.Payment.update(payment.id, { request_id: link.id, request_description: link.description || '' });
  }
  if (link?.kind === 'SINGLE_USE') await client.entities.PayLink.updateMany({ id: link.id, status: 'PROCESSING', processing_signature: signature }, { $set: { status: 'PAID', paid_at: payment.confirmed_at, payment_id: payment.id } });
  return payment;
}