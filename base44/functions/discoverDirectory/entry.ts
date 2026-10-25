import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { secrets } from 'base44:runtime';
import { verifyHuman } from '../../shared/integrationSecurity.ts';
import { digest } from '../../shared/integrationOptions.ts';
export default async function(req) {
  try {
    if (req.method !== 'POST') return Response.json({error:'Method not allowed.'},{status:405});
    const raw = await req.text();
    if (raw.length > 16000) return Response.json({error:'Submission too large.'},{status:413});
    let body; try { body = JSON.parse(raw); } catch { return Response.json({error:'Invalid request.'},{status:400}); }
    if (!body || typeof body !== 'object') return Response.json({error:'Invalid request.'},{status:400});
    if (body.action === 'config') return Response.json({site_key:secrets.get('TURNSTILE_SITE_KEY')},{headers:{'Cache-Control':'no-store'}});
    const client = createClientFromRequest(req);
    if (body.action === 'approve') {
      const user = await client.auth.me().catch(() => null);
      if (user?.role !== 'admin') return Response.json({error:'Administrators only.'},{status:403});
      if (!/^[a-f0-9]{24}$/.test(body.id || '')) return Response.json({error:'Invalid submission.'},{status:400});
      const db = client.entities, record = await db.DiscoverSubmission.get(body.id);
      if (!record) return Response.json({error:'Submission not found.'},{status:404});
      if (record.status === 'APPROVED' && record.linked_listing_id) return Response.json({listing_id:record.linked_listing_id});
      let listing;
      if (body.link_id) {
        if (!/^[a-f0-9]{24}$/.test(body.link_id)) return Response.json({error:'Choose an existing listing.'},{status:400});
        listing = await db.NetworkProject.get(body.link_id);
        if (!listing) return Response.json({error:'Listing not found.'},{status:404});
      } else {
        const existing = await db.NetworkProject.filter({source_reference:record.reference},{limit:1});
        listing = existing.items[0];
        if (!listing) {
          const data = Object.fromEntries(['listing_type','name','summary','description','category','expertise','website','social_links','handle','product_status'].map(key => [key,record[key]]).filter(([,value]) => value !== undefined));
          listing = await db.NetworkProject.create({...data,status:'DRAFT',featured:false,source_reference:record.reference});
        }
      }
      await db.DiscoverSubmission.update(record.id,{status:'APPROVED',linked_listing_id:listing.id});
      return Response.json({listing_id:listing.id});
    }
    if (body.action !== 'submit') return Response.json({error:'Unknown action.'},{status:400});
    if (typeof body.receipt_token !== 'string' || !/^[a-f0-9-]{36}$/i.test(body.receipt_token)) return Response.json({error:'Missing receipt code. Refresh the page.'},{status:400});
    const text = (key,max,required=false) => { const value = typeof body[key] === 'string' ? body[key].trim() : ''; if ((required && !value) || value.length > max) throw Object.assign(new Error(`Check ${key.replaceAll('_',' ')}.`),{status:400}); return value; };
    const data = Object.fromEntries([['name',80,true],['summary',240,true],['description',3000],['expertise',120],['website',500,true],['handle',21],['reason',1000,true],['contact_email',254,true]].map(([key,max,required]) => [key,text(key,max,required)]));
    const validUrl = value => { try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password && url.hostname.includes('.') && value.length <= 500; } catch { return false; } };
    if (!['SELF','SUGGESTION'].includes(body.submission_kind) || !['PROJECT','BUILDER','PERSON'].includes(body.listing_type) || !['WALLET','DEFI','NFT','INFRASTRUCTURE','GAMING','COMMUNITY','OTHER'].includes(body.category) || !['BUILDING','LIVE','PAUSED'].includes(body.product_status)) return Response.json({error:'Choose valid listing options.'},{status:400});
    if (!validUrl(data.website) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact_email) || (data.handle && !/^@[a-z0-9]{1,20}$/.test(data.handle)) || body.consent !== true) return Response.json({error:'Check the HTTPS website, email, handle and privacy consent.'},{status:400});
    if (!Array.isArray(body.social_links) || body.social_links.length > 5 || body.social_links.some(link => typeof link !== 'string' || !validUrl(link))) return Response.json({error:'Enter up to five valid HTTPS social links.'},{status:400});
    const db = client.asServiceRole.entities, hash = await digest(body.receipt_token);
    // A random receipt capability authorizes only an idempotent acknowledgement, never access to contact details.
    const existing = await db.DiscoverSubmission.filter({receipt_hash:hash},{limit:1});
    if (existing.items[0]) return Response.json({reference:existing.items[0].reference},{headers:{'Cache-Control':'no-store'}});
    // Deliberately public intake: authenticate the human challenge before the bounded privileged insert.
    await verifyHuman(req,body,db,{action:'discover_intake',scope:'discover',limit:3});
    const reference = `SHD-${crypto.randomUUID().replaceAll('-','').slice(0,12).toUpperCase()}`;
    await db.DiscoverSubmission.create({...data,submission_kind:body.submission_kind,listing_type:body.listing_type,category:body.category,product_status:body.product_status,social_links:body.social_links,reference,receipt_hash:hash,status:'NEW',consent_at:new Date().toISOString()});
    return Response.json({reference},{status:201,headers:{'Cache-Control':'no-store'}});
  } catch (error) {
    console.error('Discover intake failed',error.message);
    return Response.json({error:error.status ? error.message : 'Unable to save right now. Please retry.'},{status:error.status || 500});
  }
}