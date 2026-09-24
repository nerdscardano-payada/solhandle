import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';
import { PublicKey } from 'npm:@solana/web3.js@1.98.4';

function decode64(value) { return Uint8Array.from(atob(value), c => c.charCodeAt(0)); }
export default async function(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const wallet = new PublicKey(String(body.wallet || '')).toBase58();
    const time = Number(body.timestamp);
    if (!Number.isSafeInteger(time) || Math.abs(Date.now() - time) > 5 * 60 * 1000) return Response.json({ error: 'Wallet authorization expired. Sign again.' }, { status: 401 });
    const message = new TextEncoder().encode(`SolHandle Pay history\nWallet: ${wallet}\nTime: ${time}`);
    const key = await crypto.subtle.importKey('raw', new PublicKey(wallet).toBytes(), { name: 'Ed25519' }, false, ['verify']);
    if (!await crypto.subtle.verify('Ed25519', key, decode64(String(body.signature || '')), message)) return Response.json({ error: 'Wallet authorization failed.' }, { status: 403 });
    const base44 = createClientFromRequest(req);
    if (body.action === 'incoming') {
      const rows = await base44.asServiceRole.entities.Payment.filter({ receiver_wallet: wallet, status: 'CONFIRMED' }, '-confirmed_at', 50);
      return Response.json({ payments: rows });
    }
    if (body.action === 'receipt' && typeof body.id === 'string') {
      const rows = await base44.asServiceRole.entities.Payment.filter({ id: body.id, status: 'CONFIRMED' }, '-created_at', 1);
      const payment = rows[0];
      if (!payment || (payment.sender_wallet !== wallet && payment.receiver_wallet !== wallet)) return Response.json({ error: 'Receipt not found for this wallet.' }, { status: 404 });
      return Response.json({ payment });
    }
    return Response.json({ error: 'Unsupported request.' }, { status: 400 });
  } catch (error) { return Response.json({ error: error.message || 'Could not load payments.' }, { status: 400 }); }
}