import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { secrets } from 'base44:runtime';
import nacl from 'npm:tweetnacl@1.0.3';
import bs58 from 'npm:bs58@6.0.0';
import { getOwnedActiveHandles } from '../../shared/ownedHandles.ts';

const hashToken = async (token) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token)))).map((byte) => byte.toString(16).padStart(2, '0')).join('');
const challenge = (session, wallet, token) => `SolHandle Discord Verification\n\nDiscord user: ${session.discord_user_id}\nWallet: ${wallet}\nSession: ${token}\n\nThis request will not trigger a transaction.`;

export default async function(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const token = String(body.token || '');
    const wallet = String(body.wallet || '');
    if (!/^[A-Za-z0-9_-]{40,50}$/.test(token) || !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(wallet)) return Response.json({ error: 'Invalid verification request.' }, { status: 400 });
    const base44 = createClientFromRequest(req);
    const sessions = await base44.asServiceRole.entities.DiscordVerification.filter({ token_hash: await hashToken(token) }, '-created_date', 1);
    const session = sessions[0];
    if (!session || session.status !== 'PENDING') return Response.json({ error: 'This verification link is invalid or already used.' }, { status: 400 });
    if (new Date(session.expires_at).getTime() < Date.now()) { await base44.asServiceRole.entities.DiscordVerification.update(session.id, { status: 'EXPIRED' }); return Response.json({ error: 'This verification link has expired. Run /verify again in Discord.' }, { status: 410 }); }
    const message = challenge(session, wallet, token);
    if (body.action === 'challenge') return Response.json({ message });
    const signature = Uint8Array.from(atob(String(body.signature || '')), (character) => character.charCodeAt(0));
    if (!nacl.sign.detached.verify(new TextEncoder().encode(message), signature, bs58.decode(wallet))) return Response.json({ error: 'The wallet signature is invalid.' }, { status: 400 });
    const handles = await getOwnedActiveHandles(base44, secrets.get('SOLANA_RPC_URL'), wallet);
    if (!handles.length) return Response.json({ error: 'This wallet does not currently own an active SolHandle.' }, { status: 403 });
    const roleResponse = await fetch(`https://discord.com/api/v10/guilds/${secrets.get('DISCORD_GUILD_ID')}/members/${session.discord_user_id}/roles/${secrets.get('DISCORD_HOLDER_ROLE_ID')}`, { method: 'PUT', headers: { Authorization: `Bot ${secrets.get('DISCORD_BOT_TOKEN')}` } });
    if (!roleResponse.ok) return Response.json({ error: 'Wallet verified, but Discord could not assign the role. Check the bot role hierarchy.' }, { status: 502 });
    await base44.asServiceRole.entities.DiscordVerification.update(session.id, { status: 'VERIFIED', wallet_address: wallet, verified_handle: handles[0].handle, verified_at: new Date().toISOString() });
    return Response.json({ verified: true, handle: handles[0].display });
  } catch (error) { return Response.json({ error: error.message || 'Wallet verification failed.' }, { status: 500 }); }
}