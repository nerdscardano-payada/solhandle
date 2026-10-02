import { base44 } from '@/api/base44Client';
export const from64 = value => Uint8Array.from(atob(value), c => c.charCodeAt(0));
export const to64 = value => btoa(String.fromCharCode(...value));
export async function pilotCall(action, payload) {
  const name = ['availability', 'quote', 'report', 'reconcile'].includes(action) ? 'partnerMintRead' : 'partnerMintTransaction';
  const { data } = await base44.functions.invoke(name, { ...payload, action, cluster: 'devnet' });
  if (data.error) throw new Error(data.error.message || data.error.code);
  return data;
}
export const pilotMessage = error => error.response?.data?.error?.message || error.response?.data?.error?.code || error.message;
export const solAmount = value => { const n = BigInt(value), fraction = (n % 1000000000n).toString().padStart(9, '0').replace(/0+$/, ''); return `${n / 1000000000n}${fraction ? '.' + fraction : ''}`; };