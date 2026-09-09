import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { secrets } from 'base44:runtime';
import { getOwnedActiveHandles } from '../../shared/ownedHandles.ts';
import { hashToken, verifyLoungeSignature } from '../../shared/loungeAuth.ts';

export default async function(req: Request): Promise<Response> {
  try {
    const body = await req.json(); const wallet = String(body.wallet || '');
    if (!verifyLoungeSignature(wallet, body.timestamp, String(body.nonce || ''), String(body.signature || ''))) return Response.json({ error: 'Wallet verification failed.' }, { status: 400 });
    const base44 = createClientFromRequest(req); const handles = await getOwnedActiveHandles(base44, secrets.get('SOLANA_RPC_URL'), wallet);
    if (!handles.length) return Response.json({ error: 'An active SolHandle is required to enter the lounge.' }, { status: 403 });
    let appUser = null; try { appUser = await base44.auth.me(); } catch {}
    const members = await base44.asServiceRole.entities.LoungeMember.filter({ wallet_address: wallet }, '-created_date', 1);
    const handle = handles[0]; const display = handle.display || `@${handle.handle}`; const now = new Date().toISOString();
    let member = members[0];
    if (!member) member = await base44.asServiceRole.entities.LoungeMember.create({ wallet_address: wallet, display_handle: display, role: appUser?.role === 'admin' ? 'admin' : 'holder', banned: false, joined_date: now });
    else if (appUser?.role === 'admin' && member.role !== 'admin') member = await base44.asServiceRole.entities.LoungeMember.update(member.id, { role: 'admin' });
    const bytes = crypto.getRandomValues(new Uint8Array(36)); const token = btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    await base44.asServiceRole.entities.LoungeSession.create({ token_hash: await hashToken(token), wallet_address: wallet, display_handle: display, rarity: handle.rarity || 'STANDARD', role: member.role, expires_at: new Date(Date.now() + 20 * 60 * 1000).toISOString() });
    const [channels, messages] = await Promise.all([base44.asServiceRole.entities.LoungeChannel.list('order', 20), base44.asServiceRole.entities.LoungeMessage.list('-created_date', 300)]);
    return Response.json({ token, member, channels, messages: messages.reverse() });
  } catch (error) { return Response.json({ error: error.message || 'Could not open the lounge.' }, { status: 500 }); }
}