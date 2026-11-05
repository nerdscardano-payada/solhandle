import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { secrets } from 'base44:runtime';
import { passportInput, issuePassportProof, verifyPassportProof } from '../../shared/tokenPassportProof.ts';
import { passportEnrollment } from '../../shared/tokenPassportEnrollment.ts';
import { passportAdmin } from '../../shared/tokenPassportAdmin.ts';
import { passportChain } from '../../shared/tokenPassportChain.ts';
export default async function(req) {
  const headers = { 'Cache-Control': 'no-store' };
  try {
    if (req.method !== 'POST') return Response.json({ error: 'Gebruik POST.' }, { status: 405, headers });
    const text = await req.text(); if (text.length > 12000) return Response.json({ error: 'Verzoek is te groot.' }, { status: 413, headers });
    let body; try { body = JSON.parse(text); } catch { return Response.json({ error: 'Ongeldig verzoek.' }, { status: 400, headers }); }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return Response.json({ error: 'Ongeldig verzoek.' }, { status: 400, headers });
    const base44 = createClientFromRequest(req);
    if (['adminReport','adminLaunch','adminInvite','adminExclude'].includes(body.action)) return Response.json(await passportAdmin(base44, body), { headers });
    if (body.action === 'config') {
      const page = await base44.entities.TokenPassportPilot.filter({ scope: 'passport-pilot-v1' }, { sort: 'created_date', limit: 1 });
      return Response.json({ pilot: page.items[0] || null, siteKey: secrets.get('TURNSTILE_SITE_KEY') }, { headers });
    }
    if (body.action === 'public') {
      if (!/^[a-f0-9-]{36}$/.test(body.key || '')) return Response.json({ error: 'Passport niet gevonden.' }, { status: 404, headers });
      const row = (await base44.entities.TokenPassport.filter({ key: body.key, status: 'published' }, { limit: 1 })).items[0];
      if (!row) return Response.json({ error: 'Passport niet gevonden.' }, { status: 404, headers });
      let current;
      try { const live = await passportChain(secrets.get('SOLANA_RPC_URL'), row, false); current = { status: live.identity?.verified && live.identity.address === row.wallet && live.identity.assetAddress === row.asset ? 'current' : 'ownership_changed', checked_at: live.checked_at, token: live.token }; }
      catch { current = { status: 'unavailable', checked_at: new Date().toISOString() }; }
      return Response.json({ passport: row, current }, { headers });
    }
    if (!['challenge','authorize'].includes(body.action)) return Response.json({ error: 'Onbekende actie.' }, { status: 400, headers });
    const input = passportInput(body);
    const pilot = (await base44.entities.TokenPassportPilot.filter({ id: input.pilot_id, scope: 'passport-pilot-v1' }, { limit: 1 })).items[0];
    if (!pilot) return Response.json({ error: 'Geen actieve pilot.' }, { status: 404, headers });
    if (input.operation !== 'withdraw' && (Date.now() < Date.parse(pilot.starts_at) || Date.now() >= Date.parse(pilot.ends_at))) return Response.json({ error: 'De pilotperiode is niet open.' }, { status: 409, headers });
    // Wallet-signature authentication, not a Base44 session. No private record is
    // returned or changed before a single-use proof bound to the full input is verified.
    const db = base44.asServiceRole.entities;
    const origin = new URL(req.headers.get('X-Base44-App-Url') || 'https://sol-handle-core.base44.app').origin;
    if (body.action === 'challenge') return Response.json(await issuePassportProof(req, db, input, body, origin), { headers });
    const proof = await verifyPassportProof(db, input, body, origin);
    return Response.json(await passportEnrollment(db, secrets.get('SOLANA_RPC_URL'), pilot, input, proof, body.signature), { headers });
  } catch (error) {
    return Response.json({ error: error.status ? error.message : 'De controle is tijdelijk niet beschikbaar. Er is geen succesvolle verificatie bevestigd; probeer opnieuw.' }, { status: error.status || 503, headers });
  }
}