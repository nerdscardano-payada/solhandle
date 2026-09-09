import { Actor } from 'base44:runtime/actors';
import { hashToken } from '../../shared/loungeAuth.ts';

export default class LoungeChannelRoom extends Actor {
  sessions = new Map();
  async handleStart() { this.sessions = new Map(); }
  async handleConnect(conn) { conn.send({ type: 'ready' }); }
  async handleMessage(conn, msg) {
    if (!msg || typeof msg !== 'object') return;
    if (msg.type === 'auth') {
      const token = String(msg.token || ''); const rows = await this.client.asServiceRole.entities.LoungeSession.filter({ token_hash: await hashToken(token) }, '-created_date', 1); const session = rows[0];
      if (!session || new Date(session.expires_at) <= new Date()) return conn.send({ type: 'error', error: 'Lounge session expired.' });
      const channels = await this.client.asServiceRole.entities.LoungeChannel.filter({ id: this.name }, '-created_date', 1);
      if (!channels[0] || !channels[0].read_roles.includes(session.role)) return conn.send({ type: 'error', error: 'Channel access denied.' });
      this.sessions.set(conn.id, { token, wallet: session.wallet_address });
      const messages = await this.client.asServiceRole.entities.LoungeMessage.filter({ channel_id: this.name }, 'created_date', 200);
      return conn.send({ type: 'state', messages });
    }
    const access = this.sessions.get(conn.id); if (!access) return conn.send({ type: 'error', error: 'Verify your wallet first.' });
    if (msg.type === 'post') {
      const response = await this.client.functions.invoke('postLoungeMessage', { token: access.token, channelId: this.name, body: msg.body, title: msg.title, imageUrl: msg.imageUrl, isAnnouncement: msg.isAnnouncement });
      if (response.data?.error) return conn.send({ type: 'error', error: response.data.error, clientId: msg.clientId });
      this.broadcast({ type: 'message', message: response.data.message, clientId: msg.clientId });
    } else if (msg.type === 'moderate') {
      const response = await this.client.functions.invoke('moderateLounge', { token: access.token, action: msg.action, reason: msg.reason, messageId: msg.messageId, targetWallet: msg.targetWallet });
      if (response.data?.error) return conn.send({ type: 'error', error: response.data.error });
      this.broadcast({ type: 'moderated', ...response.data });
    }
  }
  async handleClose(conn) { this.sessions.delete(conn.id); }
}