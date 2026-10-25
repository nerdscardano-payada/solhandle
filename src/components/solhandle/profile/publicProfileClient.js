import { base44 } from '@/api/base44Client';
import signConnectedMessage from '@/lib/signConnectedMessage';
export const profileMessage = error => error.response?.data?.error || error.message || 'Profile could not be updated.';
export async function publicProfileRequest(payload) {
  const { data } = await base44.functions.invoke('handleProfiles', payload);
  if (data.error) throw new Error(data.error);
  return data;
}
export async function signedProfileRequest(session, handle, purpose, payload = {}) {
  const wallet = session.publicKey?.toBase58();
  if (!wallet) throw new Error('Connect your wallet first.');
  const input = { wallet, handle, purpose, ...payload };
  const proof = await publicProfileRequest({ ...input, action: 'challenge' });
  const bytes = await signConnectedMessage(session, new TextEncoder().encode(proof.message));
  if (session.wallet?.adapter?.publicKey?.toBase58() !== wallet) throw new Error('Wallet changed. Please try again.');
  const signature = btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join(''));
  return publicProfileRequest({ ...input, action: 'authorize', challengeKey: proof.challengeKey, signature });
}