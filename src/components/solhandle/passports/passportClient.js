import { base44 } from '@/api/base44Client';
import signConnectedMessage from '@/lib/signConnectedMessage';
export async function passportRequest(payload) {
  const { data } = await base44.functions.invoke('tokenPassports', payload);
  if (data.error) throw new Error(data.error);
  return data;
}
export async function signPassport(session, input, turnstile_token) {
  const wallet = session.publicKey?.toBase58();
  if (!wallet) throw new Error('Verbind eerst je wallet.');
  const payload = { ...input, wallet };
  const proof = await passportRequest({ ...payload, action: 'challenge', turnstile_token });
  const bytes = await signConnectedMessage(session, new TextEncoder().encode(proof.message));
  if (session.wallet?.adapter?.publicKey?.toBase58() !== wallet) throw new Error('Wallet gewijzigd. Probeer opnieuw.');
  const signature = btoa(Array.from(bytes, b => String.fromCharCode(b)).join(''));
  return passportRequest({ ...payload, action: 'authorize', challengeKey: proof.challengeKey, signature });
}
export const passportError = error => error.response?.data?.error || error.message || 'De aanvraag kon niet worden afgerond.';