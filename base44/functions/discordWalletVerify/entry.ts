import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { secrets } from 'base44:runtime';
import nacl from 'npm:tweetnacl@1.0.3';
import bs58 from 'npm:bs58@6.0.0';
import { getOwnedActiveHandles } from '../../shared/ownedHandles.ts';

const hashToken = async (token) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token)))).map((byte) => byte.toString(16).padStart(2, '0')).join('');
const challenge = (session, wallet, token) => `SolHandle Discord Verification\n\nDiscord user: ${session.discord_user_id}\nWallet: ${wallet}\nSession: ${token}\n\nThis request will not trigger a transaction.`;

export default async function(req: Request): Promise<Response> {
  try {
    const body = await req.json(); const token = String(body.token || ''); const wallet = String(body.wallet || '');
    if (!/^[A-Za-z0-9_-]{40,50}$/.test(token) || !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(wallet)) return Response.json({ error: 'Invalid verification request.' }, { status: 400 });
    const base44 = createClientFromRequest(req);
    const sessions = await base44.asServiceRole.entities.DiscordVerification.filter({ token_hash: await hashToken(token) }, '-created_date', 1);
    const session = sessions[0];
    if (!session || session.status !== 'PENDING' || new Date(session.expires_at) <= new Date()) return Response.json({ error: 'Verification link is invalid or expired.' }, { status: 410 });
    const message = challenge(session, wallet, token);
    if (body.action === 'challenge') return Response.json({ message });
    if (body.action !== 'verify' || !body.signature) return Response.json({ error: 'Invalid action.' }, { status: 400 });
    const valid = nacl.sign.detached.verify(new TextEncoder().encode(message), Uint8Array.from(atob(body.signature), (char) => char.charCodeAt(0)), bs58.decode(wallet));
    if (!valid) return Response.json({ error: 'Wallet signature is invalid.' }, { status: 400 });
    const handles = await getOwnedActiveHandles(base44, wallet);
    if (!handles.length) return Response.json({ error: 'This wallet does not own an active SolHandle.' }, { status: 403 });
    const roleResponse = await fetch(`https://discord.com/api/v10/guilds/${session.guild_id}/members/${session.discord_user_id}/roles/${secrets.get('DISCORD_HOLDER_ROLE_ID')}`, { method: 'PUT', headers: { Authorization: `Bot ${secrets.get('DISCORD_BOT_TOKEN')}` } });
    if (!roleResponse.ok) return Response.json({ error: 'Discord could not add the holder role.' }, { status: 502 });
    const verifiedHandle = handles[0].displayHandle || `@${handles[0].handle}`;
    await base44.asServiceRole.entities.DiscordVerification.update(session.id, { wallet_address: wallet, verified_handle: verifiedHandle, status: 'VERIFIED', verified_at: new Date().toISOString() });
    return Response.json({ verified: true, handle: verifiedHandle });
  } catch (error) { return Response.json({ error: error.message || 'Wallet verification failed.' }, { status: 500 }); }
}