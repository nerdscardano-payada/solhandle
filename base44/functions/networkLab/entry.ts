import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { networkFlags } from '../../shared/networkFlags.ts';
import { testActor, options } from '../../shared/networkLabContext.ts';
import { labProfiles } from '../../shared/networkLabProfiles.ts';
import { labPosts } from '../../shared/networkLabPosts.ts';
import { labInteract } from '../../shared/networkLabInteractions.ts';
import { labSafety } from '../../shared/networkLabSafety.ts';
import { labEntitlements } from '../../shared/networkEntitlements.ts';
export default async function(req) {
  try {
    if (req.method !== 'POST') return Response.json({ error: 'POST required' }, { status: 405 });
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Administrator development access required' }, { status: 403 });
    if (!networkFlags.developmentSocial) return Response.json({ error: 'Development social access is disabled' }, { status: 403 });
    const input = await req.json();
    options(input);
    const db = base44.entities;
    if (['bootstrap', 'createIdentity'].includes(input.action)) return Response.json(await labProfiles(db, user, input, null));
    const actor = await testActor(db, user, input.actorId);
    if (['saveProfile', 'people', 'profile', 'relations'].includes(input.action)) return Response.json(await labProfiles(db, user, input, actor));
    if (['publish', 'deletePost', 'editPost', 'feed', 'post'].includes(input.action)) return Response.json(await labPosts(db, input, actor));
    if (input.action === 'interact') return Response.json(await labInteract(db, input, actor));
    if (['entitlements', 'setEntitlement'].includes(input.action)) return Response.json(await labEntitlements(db, input, actor));
    if (['report', 'reports', 'moderate', 'moderationHistory', 'notifications', 'notificationRead'].includes(input.action)) return Response.json(await labSafety(db, user, input, actor));
    return Response.json({ error: 'Unknown development operation' }, { status: 400 });
  } catch (error) {
    const status = error.status || error.response?.status || 500;
    if (status >= 500) console.error('Network development error', error.message);
    return Response.json({ error: status >= 500 ? 'Development operation failed. Please retry.' : error.message }, { status });
  }
}