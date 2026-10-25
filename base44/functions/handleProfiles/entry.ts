import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { secrets } from 'base44:runtime';
import { resolveOnChain } from '../../shared/solhandleResolver.ts';
import { profileInput, profileError, profileProof, profilePayload } from '../../shared/handleProfileProof.ts';
export default async function(req) {
  const headers = { 'Cache-Control': 'no-store' };
  try {
    if (req.method !== 'POST') return Response.json({ error: 'Use POST.' }, { status: 405, headers });
    const text = await req.text();
    if (text.length > 10000) return Response.json({ error: 'Profile request too large.' }, { status: 413, headers });
    let body; try { body = JSON.parse(text); } catch { return Response.json({ error: 'Invalid request.' }, { status: 400, headers }); }
    if (!body || typeof body !== 'object') return Response.json({ error: 'Invalid request.' }, { status: 400, headers });
    const handle = profileInput(body);
    if (!['public', 'challenge', 'authorize'].includes(body.action)) return Response.json({ error: 'Invalid operation.' }, { status: 400, headers });
    // No Base44 login session is issued. As with walletContacts, wallet signatures
    // authorize narrowly scoped access; private records are never directly readable.
    const db = createClientFromRequest(req).asServiceRole.entities;
    if (body.action === 'public') {
      const page = await db.HandlePublicProfile.filter({ handle, published: true }, { sort: '-updated_date', limit: 50 });
      if (!page.items.length) return Response.json({ profile: null }, { headers });
      const current = await resolveOnChain(secrets.get('SOLANA_RPC_URL'), handle);
      const profile = page.items.find(row => current?.verified && row.wallet === current.address && row.asset === current.assetAddress);
      // Permanently hide observed former-owner publications, retaining their private drafts.
      if (current) await db.HandlePublicProfile.updateMany({ handle, published: true, wallet: { $ne: current.address } }, { $set: { published: false } });
      return Response.json({ profile: profile ? { handle, bio: profile.bio, social_links: profile.social_links } : null }, { headers });
    }
    const origin = new URL(req.headers.get('X-Base44-App-Url') || 'https://sol-handle-core.base44.app').origin;
    // Proof is bound to the exact operation, payload, wallet, handle and application.
    if (body.action === 'authorize') await profileProof(db, body, origin);
    const current = await resolveOnChain(secrets.get('SOLANA_RPC_URL'), handle);
    if (!current?.verified || current.address !== body.wallet) throw profileError('This wallet does not currently own this official SolHandle.', 403);
    if (body.action === 'challenge') return Response.json(await profileProof(db, body, origin), { headers });
    const { items } = await db.HandlePublicProfile.filter({ wallet: body.wallet, handle, asset: current.assetAddress }, { sort: '-updated_date', limit: 1 });
    let profile = items[0];
    if (body.purpose === 'save') {
      const fields = { wallet: body.wallet, handle, asset: current.assetAddress, ...profilePayload(body) };
      await db.HandlePublicProfile.updateMany({ handle, published: true, wallet: { $ne: body.wallet } }, { $set: { published: false } });
      if (profile) { await db.HandlePublicProfile.updateMany({ wallet: body.wallet, handle, asset: current.assetAddress }, { $set: fields }); profile = fields; }
      else profile = await db.HandlePublicProfile.create(fields);
    } else if (!profile) profile = await db.HandlePublicProfile.create({ wallet: body.wallet, handle, asset: current.assetAddress, bio: '', social_links: [], published: false });
    return Response.json({ profile: { handle, bio: profile.bio, social_links: profile.social_links, published: profile.published } }, { headers });
  } catch (error) {
    return Response.json({ error: error.status ? error.message : 'Profile verification is temporarily unavailable. Please retry.' }, { status: error.status || 503, headers });
  }
}