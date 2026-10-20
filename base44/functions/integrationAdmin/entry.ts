import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { options, statuses, text, fail } from '../../shared/integrationOptions.ts';
export default async function(req) {
  try {
    const client = createClientFromRequest(req);
    if (!await client.auth.isAuthenticated()) fail('Sign in required.',401);
    const user = await client.auth.me(); if (user?.role !== 'admin') fail('Administrator access required.',403);
    const raw = await req.text(); if (raw.length > 8000) fail('Request too large.',413);
    let body; try { body = JSON.parse(raw); } catch { fail('Invalid request.'); }
    const db = client.entities, type = body.type === 'nomination' ? 'nomination' : 'project';
    const entity = type === 'project' ? db.IntegrationSubmission : db.IntegrationNomination;
    if (body.action === 'list') {
      const query = {};
      if (statuses.includes(body.status)) query.status = body.status;
      if (options.product_types.includes(body.category)) query[type === 'project' ? 'product_types' : 'category'] = body.category;
      if (type === 'project' && options.network.includes(body.network)) query.network = body.network;
      if (body.since && /^\d{4}-\d{2}-\d{2}$/.test(body.since)) query.created_date = {$gte:`${body.since}T00:00:00.000Z`};
      if (['NORMAL','REVIEW','HIGH'].includes(body.priority)) query.priority = body.priority;
      const [page, totals, nominations] = await Promise.all([entity.filter(query,{sort:'-created_date',limit:25,cursor:body.cursor || undefined,fields:['reference','project_name','status','priority','product_types','category','created_date','technical_review_requested','recommendations','project_key']}),db.IntegrationSubmission.aggregate({groupBy:'status'}),db.IntegrationNomination.count({status:'NEW'})]);
      return Response.json({ ...page, totals:totals.rows, new_nominations:nominations });
    }
    if (!/^[a-f0-9]{24}$/.test(body.id || '')) fail('Invalid submission.');
    const record = await entity.get(body.id); if (!record) fail('Submission not found.',404);
    if (body.action === 'update') {
      const changes = {};
      if (body.status !== undefined) { if (!statuses.includes(body.status)) fail('Invalid status.'); changes.status = body.status; }
      if (body.priority !== undefined) { if (!['NORMAL','REVIEW','HIGH'].includes(body.priority)) fail('Invalid priority.'); changes.priority = body.priority; }
      const note = text(body.note,'note',1000);
      if (Object.keys(changes).length) await entity.update(record.id,changes);
      await db.IntegrationActivity.create({submission_id:record.id,submission_type:type,action_type:Object.keys(changes).length ? 'UPDATED' : 'NOTE',note:[changes.status ? `Status: ${record.status} → ${changes.status}` : '',changes.priority ? `Priority: ${changes.priority}` : '',note].filter(Boolean).join('\n'),actor_id:user.id});
    } else if (body.action !== 'detail') fail('Unknown action.');
    const [fresh, history, related] = await Promise.all([entity.get(body.id),db.IntegrationActivity.filter({submission_id:body.id,submission_type:type},{sort:'-created_date',limit:50}),db.IntegrationNomination.count({project_key:record.project_key})]);
    const {receipt_hash,...safe} = fresh;
    return Response.json({record:safe,history,nomination_count:related});
  } catch (error) { return Response.json({error:error.status ? error.message : 'Unable to load integration records.'},{status:error.status || 503}); }
}