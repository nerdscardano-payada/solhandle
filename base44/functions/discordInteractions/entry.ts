import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { secrets } from 'base44:runtime';
import nacl from 'npm:tweetnacl@1.0.3';

const hexBytes = (value) => new Uint8Array((value.match(/.{1,2}/g) || []).map((byte) => parseInt(byte, 16)));
const tokenString = (bytes) => btoa(String.fromCharCode(...bytes)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
const tokenHash = async (token) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token)))).map((byte) => byte.toString(16).padStart(2, '0')).join('');

export default async function(req: Request): Promise<Response> {
  try {
    const bodyText = await req.text();
    const timestamp = req.headers.get('x-signature-timestamp') || '';
    const signature = req.headers.get('x-signature-ed25519') || '';
    const publicKey = secrets.get('DISCORD_PUBLIC_KEY') || '';
    const valid = signature.length === 128 && publicKey.length === 64 && nacl.sign.detached.verify(new TextEncoder().encode(timestamp + bodyText), hexBytes(signature), hexBytes(publicKey));
    if (!valid) return new Response('Invalid request signature', { status: 401 });
    const interaction = JSON.parse(bodyText);
    if (interaction.type === 1) return Response.json({ type: 1 });
    if (interaction.type !== 2 || interaction.data?.name !== 'verify') return Response.json({ type: 4, data: { content: 'Unknown command.', flags: 64 } });
    const guildId = secrets.get('DISCORD_GUILD_ID');
    if (interaction.guild_id !== guildId) return Response.json({ type: 4, data: { content: 'This command is only available in the official SolHandle server.', flags: 64 } });
    const random = new Uint8Array(32); crypto.getRandomValues(random);
    const token = tokenString(random);
    const base44 = createClientFromRequest(req);
    await base44.asServiceRole.entities.DiscordVerification.create({
      token_hash: await tokenHash(token), discord_user_id: interaction.member.user.id,
      discord_username: interaction.member.user.global_name || interaction.member.user.username,
      guild_id: guildId, status: 'PENDING', expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
    });
    const url = `https://solhandle.io/discord-verify?token=${token}`;
    return Response.json({ type: 4, data: { content: 'Connect and sign with the wallet that owns your SolHandle. This link expires in 10 minutes.', flags: 64, components: [{ type: 1, components: [{ type: 2, style: 5, label: 'Verify wallet', url }] }] } });
  } catch (error) { return Response.json({ error: error.message || 'Discord interaction failed.' }, { status: 500 }); }
}