import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

function parseTarget(value) {
  if (typeof value !== 'string' || !value.trim() || value.length > 2048 || /[\s\\\u0000-\u001f]/u.test(value)) throw new Error('Enter an HTTPS URL or a domain, without spaces.');
  const raw = value.trim();
  const url = new URL(raw.includes('://') ? raw : `https://${raw}`);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.port) throw new Error('Only HTTP(S) domains without credentials or custom ports are supported.');
  const hostname = url.hostname.toLowerCase().replace(/\.$/, '');
  if (hostname.length > 253 || !hostname.includes('.') || !hostname.split('.').every(x => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/u.test(x)) || /^[\d.]+$/u.test(hostname)) throw new Error('Enter a valid public domain name, not an IP address.');
  if (['localhost', 'local', 'internal', 'test', 'invalid'].some(x => hostname === x || hostname.endsWith(`.${x}`))) throw new Error('Local and test domains are not supported.');
  return { hostname, insecure: url.protocol === 'http:', international: hostname.split('.').some(x => x.startsWith('xn--')) };
}

export default async function(req) {
  try {
    if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });
    const base44 = createClientFromRequest(req);
    let user;
    try { user = await base44.auth.me(); } catch { return Response.json({ error: 'Sign in required' }, { status: 401 }); }
    if (!user) return Response.json({ error: 'Sign in required' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Administrators only' }, { status: 403 });
    const text = await req.text();
    if (text.length > 5000) return Response.json({ error: 'Request too large' }, { status: 413 });
    let body;
    try { body = JSON.parse(text); } catch { return Response.json({ error: 'Invalid request' }, { status: 400 }); }
    if (body.action === 'history') {
      const query = {};
      if (body.hostname) {
        try { query.hostname = parseTarget(body.hostname).hostname; } catch (error) { return Response.json({ error: error.message }, { status: 400 }); }
      }
      if (body.classification) {
        if (!['TRUSTED', 'NORMAL', 'SUSPICIOUS', 'BLOCKED'].includes(body.classification)) return Response.json({ error: 'Invalid classification' }, { status: 400 });
        query.classification = body.classification;
      }
      if (body.cursor && (typeof body.cursor !== 'string' || body.cursor.length > 4096)) return Response.json({ error: 'Invalid cursor' }, { status: 400 });
      const page = await base44.entities.NetworkDomainDecision.filter(query, { sort: '-created_date', limit: 25, ...(body.cursor ? { cursor: body.cursor } : {}) });
      return Response.json(page);
    }
    if (!['decide', 'check'].includes(body.action)) return Response.json({ error: 'Unknown action' }, { status: 400 });
    let target;
    try { target = parseTarget(body.target); } catch (error) { return Response.json({ error: error.message }, { status: 400 }); }
    if (body.action === 'decide') {
      if (!['TRUSTED', 'NORMAL', 'SUSPICIOUS', 'BLOCKED'].includes(body.classification) || typeof body.reason !== 'string' || body.reason.trim().length < 10 || body.reason.trim().length > 1000) return Response.json({ error: 'Choose a classification and give a reason of 10–1000 characters.' }, { status: 400 });
      const record = await base44.entities.NetworkDomainDecision.create({ hostname: target.hostname, classification: body.classification, reason: body.reason.trim(), actor_id: user.id, decided_at: new Date().toISOString() });
      return Response.json({ record });
    }
    const page = await base44.entities.NetworkDomainDecision.filter({ hostname: target.hostname }, { sort: '-created_date', limit: 1 });
    const decision = page.items[0] || null;
    const classification = decision?.classification || 'UNKNOWN';
    const outcome = classification === 'BLOCKED' ? 'BLOCK' : classification === 'SUSPICIOUS' || classification === 'UNKNOWN' || target.insecure || target.international ? 'WARN' : 'ALLOW';
    return Response.json({ ...target, classification, outcome, reason: decision?.reason || 'No reviewed policy exists for this exact hostname.', decided_at: decision?.decided_at || null, disclaimer: 'Policy lookup only, not a live malware scan or a safety guarantee. Subdomains are evaluated separately.' });
  } catch (error) {
    console.error('Network domain policy request failed', error.message);
    return Response.json({ error: 'Unable to process the domain policy request.' }, { status: 500 });
  }
}