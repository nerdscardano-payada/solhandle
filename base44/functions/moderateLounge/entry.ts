import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { getLoungeSession } from '../../shared/loungeAuth.ts';

export default async function(req: Request): Promise<Response> {
  try {
    const body = await req.json(); const base44 = createClientFromRequest(req); const session = await getLoungeSession(base44, body.token);
    if (!session || !['admin', 'mod'].includes(session.role)) return Response.json({ error: 'Moderator access required.' }, { status: 403 });
    const action = String(body.action || ''); const reason = String(body.reason || '').trim();
    if (!['delete', 'mute', 'unmute', 'ban', 'unban'].includes(action) || reason.length < 3) return Response.json({ error: 'Select an action and provide a reason.' }, { status: 400 });
    let targetWallet = String(body.targetWallet || ''); let messageId = String(body.messageId || '');
    if (action === 'delete') {
      const messages = await base44.asServiceRole.entities.LoungeMessage.filter({ id: messageId }, '-created_date', 1); if (!messages[0]) return Response.json({ error: 'Message not found.' }, { status: 404 });
      targetWallet = messages[0].wallet_address; await base44.asServiceRole.entities.LoungeMessage.delete(messageId);
    } else {
      const members = await base44.asServiceRole.entities.LoungeMember.filter({ wallet_address: targetWallet }, '-created_date', 1); const member = members[0];
      if (!member || member.role === 'admin') return Response.json({ error: 'This member cannot be moderated.' }, { status: 400 });
      const update = action === 'mute' ? { muted_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() } : action === 'unmute' ? { muted_until: new Date(0).toISOString() } : { banned: action === 'ban' };
      await base44.asServiceRole.entities.LoungeMember.update(member.id, update);
    }
    await base44.asServiceRole.entities.LoungeModerationLog.create({ admin_wallet: session.wallet_address, target_wallet: targetWallet, action, reason, message_id: messageId });
    return Response.json({ ok: true, action, messageId, targetWallet });
  } catch (error) { return Response.json({ error: error.message || 'Moderation failed.' }, { status: 500 }); }
}