import { secrets } from 'base44:runtime';
import { digest, fail } from './integrationOptions.ts';
export async function verifyHuman(req, body, db, options = {}) {
  if (body.company_fax || typeof body.turnstile_token !== 'string' || body.turnstile_token.length > 2048) fail('Complete the anti-spam check.');
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({secret:secrets.get('TURNSTILE_SECRET_KEY'),response:body.turnstile_token}), signal:AbortSignal.timeout(10000) });
  if (!response.ok) fail('Anti-spam verification is temporarily unavailable.',503);
  const verified = await response.json();
  const hosts = ['solhandle.io','www.solhandle.io','sol-handle-core.base44.app'];
  const appUrl = req.headers.get('x-base44-app-url');
  if (appUrl) { try { hosts.push(new URL(appUrl).hostname); } catch { /* only accept well formed platform URL */ } }
  if (!verified.success || verified.action !== (options.action || 'integration_intake') || !hosts.includes(verified.hostname)) fail('Anti-spam verification expired or failed. Please try again.');
  const now = new Date(), bucket = now.toISOString().slice(0,10);
  let {items} = await db.IntegrationAbuse.filter({kind:'PEPPER',bucket},{sort:'created_date',limit:1});
  const pepper = items[0] || await db.IntegrationAbuse.create({kind:'PEPPER',bucket,value:crypto.randomUUID(),expires_at:new Date(now.getTime()+172800000).toISOString()});
  const ip = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const hash = await digest(`${pepper.value}:${ip}`), since = new Date(now.getTime()-900000).toISOString();
  const scope = options.scope || (body.type === 'nomination' ? 'nomination' : 'project');
  const attempts = await db.IntegrationAbuse.count({kind:'ATTEMPT',bucket:hash,scope,created_date:{$gte:since}});
  if (attempts >= (options.limit || (scope === 'nomination' ? 3 : 6))) fail('Too many submissions. Please wait 15 minutes.',429);
  await db.IntegrationAbuse.create({kind:'ATTEMPT',bucket:hash,scope,expires_at:new Date(now.getTime()+86400000).toISOString()});
  await db.IntegrationAbuse.deleteMany({kind:{$in:['ATTEMPT','PEPPER']},expires_at:{$lt:now.toISOString()}});
}