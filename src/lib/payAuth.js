import { base44 } from '@/api/base44Client';
export async function paymentAuthorization(action, wallet, signMessage, extra = {}) {
  if (!wallet || !signMessage) throw new Error('Connect a wallet that supports message signing to view private payments.');
  const timestamp = Date.now();
  const purpose = action === 'create_link' ? `create request\n${JSON.stringify({ handle: String(extra.handle || ''), amount: String(extra.amount || ''), kind: String(extra.kind || 'REUSABLE'), description: String(extra.description || ''), expiresAt: String(extra.expiresAt || ''), ...(extra.asset == null ? {} : { asset: String(extra.asset) }) })}` : action === 'cancel_request' ? `cancel request\nRequest: ${String(extra.requestId || '')}` : 'history';
  const message = new TextEncoder().encode(`SolHandle Pay ${purpose}\nWallet: ${wallet.toBase58()}\nTime: ${timestamp}`);
  const signed = await signMessage(message);
  const signature = btoa(Array.from(signed, byte => String.fromCharCode(byte)).join(''));
  return { wallet: wallet.toBase58(), timestamp, signature };
}
export async function authorizedPayments(action, wallet, signMessage, extra = {}) {
  const proof = await paymentAuthorization(action, wallet, signMessage, extra);
  return (await base44.functions.invoke('payRecords', { action, ...proof, ...extra })).data;
}