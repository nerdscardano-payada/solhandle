import { base44 } from '@/api/base44Client';
export async function authorizedPayments(action, wallet, signMessage, extra = {}) {
  if (!wallet || !signMessage) throw new Error('Connect a wallet that supports message signing to view private payments.');
  const timestamp = Date.now();
  const message = new TextEncoder().encode(`SolHandle Pay history\nWallet: ${wallet.toBase58()}\nTime: ${timestamp}`);
  const signed = await signMessage(message);
  const signature = btoa(Array.from(signed, byte => String.fromCharCode(byte)).join(''));
  const response = await base44.functions.invoke('payRecords', { action, wallet: wallet.toBase58(), timestamp, signature, ...extra });
  return response.data;
}