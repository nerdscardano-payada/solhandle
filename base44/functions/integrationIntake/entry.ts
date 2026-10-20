import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { secrets } from 'base44:runtime';
import { options, fail, digest, capability } from '../../shared/integrationOptions.ts';
import { validateIntake } from '../../shared/integrationValidation.ts';
import { matchIntegration } from '../../shared/integrationMatch.ts';
import { verifyHuman } from '../../shared/integrationSecurity.ts';
import { publicReceipt, receiptRecord } from '../../shared/integrationReceipt.ts';
export default async function(req) {
  try {
    if (req.method !== 'POST') fail('Method not allowed.',405);
    const raw = await req.text(); if (raw.length > 18000) fail('Submission too large.',413);
    let body; try { body = JSON.parse(raw); } catch { fail('Invalid request.'); }
    if (!body || typeof body !== 'object') fail('Invalid request.');
    if (body.action === 'config') return Response.json({site_key:secrets.get('TURNSTILE_SITE_KEY'),options},{headers:{'Cache-Control':'no-store'}});
    const client = createClientFromRequest(req), db = client.asServiceRole.entities;
    if (['receipt','request_review'].includes(body.action)) {
      const {record,entity} = await receiptRecord(db,body.receipt_token,body.type);
      if (body.action === 'request_review') {
        if (body.type !== 'project') fail('Community suggestions cannot request project technical reviews.');
        if (!record.technical_review_requested) await entity.update(record.id,{technical_review_requested:true});
        record.technical_review_requested = true;
      }
      return Response.json(publicReceipt(record,body.type),{headers:{'Cache-Control':'no-store'}});
    }
    if (body.action !== 'submit') fail('Unknown action.');
    const receiptHash = await digest(capability(body.receipt_token));
    const input = validateIntake(body), entity = body.type === 'project' ? db.IntegrationSubmission : db.IntegrationNomination;
    const {items} = await entity.filter({receipt_hash:receiptHash},{limit:1});
    if (items[0]) return Response.json(publicReceipt(items[0],body.type),{headers:{'Cache-Control':'no-store'}});
    await verifyHuman(req,body,db);
    let confirmation_email = '';
    if (body.type === 'project' && await client.auth.isAuthenticated()) {
      const user = await client.auth.me();
      if (user?.email?.toLowerCase() === input.contact_email) confirmation_email = user.email;
    }
    const record = await entity.create({...input,receipt_hash:receiptHash,reference:`SHI-${crypto.randomUUID().replaceAll('-','').slice(0,12).toUpperCase()}`,...(body.type === 'project' ? {recommendations:matchIntegration(input),confirmation_email} : {})});
    return Response.json(publicReceipt(record,body.type),{status:201,headers:{'Cache-Control':'no-store'}});
  } catch (error) { return Response.json({error:error.status ? error.message : 'Unable to save right now. Retry with the same receipt code.'},{status:error.status || 503,headers:{'Cache-Control':'no-store'}}); }
}