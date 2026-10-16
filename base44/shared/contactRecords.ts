import { secrets } from 'base44:runtime';
import { contactError } from './contactSessions.ts';
import { normalizeHandle, resolveOnChain } from './solhandleResolver.ts';
const cleanHandle = value => {
  const handle = normalizeHandle(value);
  if (!/^[a-z0-9]{1,20}$/.test(handle)) throw contactError('Enter a valid @handle (1–20 letters or numbers).');
  return handle;
};
export async function ownedContact(client, wallet, id) {
  if (typeof id !== 'string' || !/^[a-f0-9]{24}$/.test(id)) throw contactError('Invalid contact.');
  const page = await client.entities.WalletContact.filter({ id, owner_wallet: wallet }, { limit: 1 });
  if (!page.items[0]) throw contactError('This contact no longer exists. Refresh your contacts.', 404);
  return page.items[0];
}
export async function contactRecords(client, wallet, body) {
  if (body.action === 'list') {
    const term = String(body.search || '').trim().slice(0, 80).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const query = { owner_wallet: wallet, ...(term ? { $or: [{ name: { $regex: term, $options: 'i' } }, { handle: { $regex: term, $options: 'i' } }] } : {}) };
    return await client.entities.WalletContact.filter(query, { sort: 'name', limit: 25, ...(typeof body.cursor === 'string' ? { cursor: body.cursor } : {}), fields: ['name', 'handle', 'recipient_wallet', 'verified_at', 'updated_date'] });
  }
  if (body.action === 'delete') {
    const contact = await ownedContact(client, wallet, body.id);
    await client.entities.WalletContact.delete(contact.id);
    return { ok: true };
  }
  if (body.action === 'resolve') {
    const resolved = await resolveOnChain(secrets.get('SOLANA_RPC_URL'), cleanHandle(body.handle));
    if (!resolved?.safeForNativeSol) throw contactError('This @handle has no safe, verified SOL recipient.');
    return { handle: resolved.handle, address: resolved.address };
  }
  if (body.action !== 'save') throw contactError('Unsupported contacts action.');
  const name = String(body.name || '').trim();
  if (!name || name.length > 80) throw contactError('Enter a contact name, up to 80 characters.');
  const existing = body.id ? await ownedContact(client, wallet, body.id) : null;
  let handle = cleanHandle(body.handle), recipient;
  if (body.paymentId) {
    if (typeof body.paymentId !== 'string' || !/^[a-f0-9]{24}$/.test(body.paymentId)) throw contactError('Invalid payment receipt.');
    const payments = await client.entities.Payment.filter({ id: body.paymentId, sender_wallet: wallet, status: 'CONFIRMED' }, { limit: 1 });
    const payment = payments.items[0];
    if (!payment) throw contactError('Only the sender can save the recipient of a confirmed payment.', 403);
    handle = cleanHandle(payment.handle); recipient = payment.receiver_wallet;
  } else if (existing && existing.handle === `@${handle}`) {
    recipient = existing.recipient_wallet;
  } else {
    const resolved = await resolveOnChain(secrets.get('SOLANA_RPC_URL'), handle);
    if (!resolved?.safeForNativeSol) throw contactError('This @handle has no safe, verified SOL recipient.');
    recipient = resolved.address;
    if (body.expectedWallet !== recipient) throw contactError('The recipient changed. Verify this contact again before saving.', 409);
  }
  if (existing && existing.recipient_wallet !== recipient) throw contactError('A saved wallet address cannot be replaced. Add a new contact to trust a different wallet.', 409);
  const data = { name, handle: `@${handle}`, recipient_wallet: recipient, owner_wallet: wallet, contact_key: `${wallet}:${recipient}`, verified_at: existing?.verified_at || new Date().toISOString() };
  if (existing) return { contact: await client.entities.WalletContact.update(existing.id, data) };
  const result = await client.entities.WalletContact.upsert([data], { key: 'contact_key' });
  return { contact: result.records[0], updatedExisting: result.updated > 0 };
}