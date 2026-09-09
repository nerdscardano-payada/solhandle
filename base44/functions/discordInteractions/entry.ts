import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { secrets } from 'base44:runtime';
import nacl from 'npm:tweetnacl@1.0.3';

const hexBytes = (value) => new Uint8Array((value.match(/.{1,2}/g) || []).map((byte) => parseInt(byte, 16)));
const hashToken = async (token) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token)))).map((byte) => byte.toString(16).padStart(2, '0')).join('');
const makeToken = () => btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');

export default async function(req: Request): Promise<Response> {
  try {
    const text = await req.text();
    const timestamp = req.headers.get('x-signature-timestamp') || '';
    const signature = req.headers.get('x-signature-ed25519') || '';
    const publicKey = secrets.get('DISCORD_PUBLIC_KEY') || '';
    const valid = signature.length === 128 && publicKey.length === 64 && nacl.sign.detached.verify(new TextEncoder().encode(timestamp + text), hexBytes(signature), hexBytes(publicKey));
    if (!valid) return new Response('Invalid request signature', { status: 401 });
    const interaction = JSON.parse(text);
    if (interaction.type === 1) return Response.json({ type: 1 });
    if (interaction.type !== 2 || interaction.data?.name !== 'verify') return Response.json({ type: 4, data: { content: 'Unknown command.', flags: 64 } });
    const base44 = createClientFromRequest(req);
    const token = makeToken();
    await base44.asServiceRole.entities.DiscordVerification.create({ token_hash: await hashToken(token), discord_user_id: interaction.member?.user?.id || interaction.user?.id, discord_username: interaction.member?.user?.username || interaction.user?.username || '', guild_id: interaction.guild_id, status: 'PENDING', expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString() });
    return Response.json({ type: 4, data: { content: 'Verify your SolHandle ownership securely:', flags: 64, components: [{ type: 1, components: [{ type: 2, style: 5, label: 'Verify wallet', url: `https://solhandle.io/discord-verify?token=${token}` }] }] } });
  } catch (error) { return Response.json({ error: error.message || 'Discord interaction failed.' }, { status: 500 }); }
}