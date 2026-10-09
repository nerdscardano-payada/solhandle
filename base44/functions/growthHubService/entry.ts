import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { issueChallenge } from '../../shared/growthHubIdentity.ts';
import { growthPublic } from '../../shared/growthHubPublic.ts';
import { growthParticipant } from '../../shared/growthHubParticipant.ts';
import { growthAdmin } from '../../shared/growthHubAdmin.ts';
export default async function(req: Request): Promise<Response> {
  try {
    if (req.method !== 'POST') return Response.json({ error: 'POST required.' }, { status: 405 });
    const text = await req.text();
    if (text.length > 10000) return Response.json({ error: 'Request too large.' }, { status: 413 });
    const body = JSON.parse(text), base44 = createClientFromRequest(req), entities = base44.asServiceRole.entities;
    if (body.scope === 'admin') {
      const user = await base44.auth.me();
      if (!user || user.role !== 'admin') return Response.json({ error: 'Alleen SolHandle-beheerders hebben toegang.' }, { status: 403 });
      return Response.json(await growthAdmin(entities, user, body));
    }
    if (['catalog', 'leaderboard'].includes(body.action)) return Response.json(await growthPublic(entities, body));
    if (body.action === 'challenge') return Response.json(await issueChallenge(entities, body.wallet));
    if (['join', 'me', 'visibility', 'start', 'verify'].includes(body.action)) return Response.json(await growthParticipant(entities, body));
    return Response.json({ error: 'Onbekende Growth Hub-actie.' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message || 'Growth Hub tijdelijk niet beschikbaar.' }, { status: 400 });
  }
}