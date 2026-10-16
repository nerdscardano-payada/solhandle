import { requireContactSession, contactError } from './contactSessions.ts';
import { ownedContact } from './contactRecords.ts';
import { classifyNativeSolDestination, resolveOnChain } from './solhandleResolver.ts';
export async function resolveContactPayment(client, rpcUrl, body, handle, sender) {
  const session = await requireContactSession(client, body);
  if (session.wallet !== sender) throw contactError('Unlock contacts with the sending wallet.', 403);
  const contact = await ownedContact(client, sender, body.contactId);
  if (contact.handle !== `@${handle}`) throw contactError('The saved contact changed. Select it again before paying.', 409);
  const [current, safety] = await Promise.all([resolveOnChain(rpcUrl, handle), classifyNativeSolDestination(rpcUrl, contact.recipient_wallet)]);
  return { handle: contact.handle, address: contact.recipient_wallet, ...safety, savedContact: true, handleChanged: current?.address !== contact.recipient_wallet };
}