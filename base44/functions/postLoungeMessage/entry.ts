import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { getLoungeSession } from '../../shared/loungeAuth.ts';

export default async function(req: Request): Promise<Response> {
  try {
    const body = await req.json(); const base44 = createClientFromRequest(req); const session = await getLoungeSession(base44, body.token);
    if (!session) return Response.json({ error: 'Your lounge session expired. Reconnect your wallet.' }, { status: 401 });
    const text = String(body.body || '').trim(); const title = String(body.title || '').trim();
    if (!text || text.length > 2000 || title.length > 120) return Response.json({ error: 'Message must contain 1–2000 characters.' }, { status: 400 });
    if (/(seed phrase|private key|double your|free airdrop|wallet validation|connect.*claim)/i.test(text)) return Response.json({ error: 'This message was blocked by the lounge safety filter.' }, { status: 400 });
    const [channels, members, recent] = await Promise.all([
      base44.asServiceRole.entities.LoungeChannel.filter({ id: String(body.channelId || '') }, '-created_date', 1),
      base44.asServiceRole.entities.LoungeMember.filter({ wallet_address: session.wallet_address }, '-created_date', 1),
      base44.asServiceRole.entities.LoungeMessage.filter({ wallet_address: session.wallet_address }, '-created_date', 10)
    ]);
    const channel = channels[0]; const member = members[0];
    if (!channel || !channel.write_roles.includes(session.role)) return Response.json({ error: 'You cannot post in this channel.' }, { status: 403 });
    if (!member || member.banned) return Response.json({ error: 'This wallet is banned from the lounge.' }, { status: 403 });
    if (member.muted_until && new Date(member.muted_until) > new Date()) return Response.json({ error: `Muted until ${member.muted_until}.` }, { status: 403 });
    if (recent[0] && Date.now() - new Date(recent[0].created_date).getTime() < 3000) return Response.json({ error: 'Please wait a moment before posting again.' }, { status: 429 });
    if (recent.some((item) => item.body.trim().toLowerCase() === text.toLowerCase())) return Response.json({ error: 'Duplicate messages are not allowed.' }, { status: 400 });
    const isAnnouncement = Boolean(body.isAnnouncement) && session.role === 'admin' && channel.slug === 'news';
    const message = await base44.asServiceRole.entities.LoungeMessage.create({ channel_id: channel.id, wallet_address: session.wallet_address, display_handle: session.display_handle, rarity: session.rarity || 'STANDARD', title: isAnnouncement ? title : '', body: text, image_url: isAnnouncement ? String(body.imageUrl || '') : '', is_announcement: isAnnouncement, parent_id: String(body.parentId || '') });
    return Response.json({ message });
  } catch (error) { return Response.json({ error: error.message || 'Message could not be posted.' }, { status: 500 }); }
}