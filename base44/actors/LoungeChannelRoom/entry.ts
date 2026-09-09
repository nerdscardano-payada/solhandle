import { Actor } from 'base44:runtime/actors';
import { hashToken } from '../../shared/loungeAuth.ts';

export default class LoungeChannelRoom extends Actor {
  sessions = new Map();
  async handleStart() { const saved = await this.storage.get('sessions'); this.sessions = saved ? new Map(saved) : new Map(); const live = new Set(this.getConnections().map((conn) => conn.id)); for (const id of this.sessions.keys()) if (!live.has(id)) this.sessions.delete(id); }
  async handleConnect(conn) { conn.send({ type: 'ready' }); }
  async handleMessage(conn, msg) {
    if (!msg || typeof msg !== 'object') return;
    if (msg.type === 'auth') {
      const token = String(msg.token || ''); const channelId = String(msg.channelId || ''); const rows = await this.client.asServiceRole.entities.LoungeSession.filter({ token_hash: await hashToken(token) }, '-created_date', 1); const session = rows[0];
      if (!session || new Date(session.expires_at) <= new Date()) return conn.send({ type: 'error', error: 'Lounge session expired.' });
      const channels = await this.client.asServiceRole.entities.LoungeChannel.filter({ id: channelId }, '-created_date', 1);
      if (!channels[0] || !channels[0].read_roles.includes(session.role)) return conn.send({ type: 'error', error: 'Channel access denied.' });
      this.sessions.set(conn.id, { token, wallet: session.wallet_address, channelId }); await this.storage.put('sessions', [...this.sessions.entries()]);
      const messages = await this.client.asServiceRole.entities.LoungeMessage.filter({ channel_id: channelId }, 'created_date', 200);
      return conn.send({ type: 'state', messages });
    }
    const access = this.sessions.get(conn.id); if (!access) return conn.send({ type: 'error', error: 'Verify your wallet first.' });
    try {
      if (msg.type === 'post') {
        const response = await this.client.functions.invoke('postLoungeMessage', { token: access.token, channelId: access.channelId, body: msg.body, title: msg.title, imageUrl: msg.imageUrl, isAnnouncement: msg.isAnnouncement });
        this.broadcast({ type: 'message', message: response.data.message, clientId: msg.clientId });
      } else if (msg.type === 'moderate') {
        const response = await this.client.functions.invoke('moderateLounge', { token: access.token, action: msg.action, reason: msg.reason, messageId: msg.messageId, targetWallet: msg.targetWallet });
        this.broadcast({ type: 'moderated', ...response.data });
      }
    } catch (error) { conn.send({ type: 'error', error: error.response?.data?.error || error.message || 'Lounge action failed.', clientId: msg.clientId }); }
  }
  async handleClose(conn) { this.sessions.delete(conn.id); await this.storage.put('sessions', [...this.sessions.entries()]); }
}