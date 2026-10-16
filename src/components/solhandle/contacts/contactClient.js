import { base44 } from '@/api/base44Client';
export const contactMessage = e => e.response?.data?.error || e.message || 'Contacts could not be synchronized.';
const key = wallet => `solhandle_contacts_access:${wallet}`;
export function readContactAccess(wallet) {
  if (!wallet) return null;
  const raw = localStorage.getItem(key(wallet));
  if (!raw) return null;
  try { const session = JSON.parse(raw); return session.wallet === wallet && Date.parse(session.expires_at) > Date.now() ? session : null; } catch { return null; }
}
export function storeContactAccess(wallet, session) {
  if (session) localStorage.setItem(key(wallet), JSON.stringify(session)); else localStorage.removeItem(key(wallet));
  window.dispatchEvent(new Event('solhandle-contacts-access'));
}
export function contactPaymentProof(wallet) {
  const session = readContactAccess(wallet);
  if (!session) throw new Error('Unlock My Contacts again before paying a saved contact.');
  return { contactsToken: session.token };
}
export async function contactRequest(action, wallet, extra = {}) {
  const session = readContactAccess(wallet);
  if (!session) throw new Error('Unlock My Contacts with your wallet first.');
  try { return (await base44.functions.invoke('walletContacts', { ...extra, action, wallet, contactsToken: session.token })).data; }
  catch (error) { if (error.response?.status === 401) storeContactAccess(wallet, null); throw error; }
}
export async function unlockContacts(publicKey, signMessage) {
  if (!publicKey || !signMessage) throw new Error('Connect a wallet that supports message signing.');
  const wallet = publicKey.toBase58();
  const { data } = await base44.functions.invoke('walletContacts', { action: 'challenge', wallet });
  const signature = btoa(Array.from(await signMessage(new TextEncoder().encode(data.message)), b => String.fromCharCode(b)).join(''));
  const response = await base44.functions.invoke('walletContacts', { action: 'verify', wallet, challengeId: data.challengeId, signature });
  storeContactAccess(wallet, response.data);
}