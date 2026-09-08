import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { secrets } from 'base44:runtime';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const appId = secrets.get('DISCORD_APPLICATION_ID');
    const guildId = secrets.get('DISCORD_GUILD_ID');
    const headers = { Authorization: `Bot ${secrets.get('DISCORD_BOT_TOKEN')}`, 'Content-Type': 'application/json' };
    const baseUrl = `https://discord.com/api/v10/applications/${appId}/guilds/${guildId}/commands`;
    const listResponse = await fetch(baseUrl, { headers });
    if (!listResponse.ok) return Response.json({ error: 'Discord credentials or server access are invalid.' }, { status: 502 });
    const commands = await listResponse.json();
    const existing = commands.find((command) => command.name === 'verify');
    const response = await fetch(existing ? `${baseUrl}/${existing.id}` : baseUrl, { method: existing ? 'PATCH' : 'POST', headers, body: JSON.stringify({ name: 'verify', type: 1, description: 'Verify SolHandle ownership and receive the Handle Holder role' }) });
    if (!response.ok) return Response.json({ error: 'Discord could not register the /verify command.' }, { status: 502 });
    const command = await response.json();
    const interactionsEndpoint = 'https://sol-handle-core.base44.app/functions/discordInteractions';
    const applicationResponse = await fetch('https://discord.com/api/v10/applications/@me', { method: 'PATCH', headers, body: JSON.stringify({ interactions_endpoint_url: interactionsEndpoint }) });
    if (!applicationResponse.ok) return Response.json({ error: 'The /verify command is registered, but Discord could not activate its interaction endpoint.' }, { status: 502 });
    return Response.json({ registered: true, commandId: command.id, interactionsEndpoint, endpointActive: true });
  } catch (error) { return Response.json({ error: error.message || 'Discord setup failed.' }, { status: 500 }); }
}