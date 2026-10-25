import { resolveOnChain } from './solhandleResolver.ts';
export async function handleProfileDirectory(db, rpcUrl, body) {
  if (body.cursor !== undefined && (typeof body.cursor !== 'string' || !body.cursor.trim() || body.cursor.length > 2048)) return Response.json({ error: 'Invalid profile cursor.' }, { status: 400 });
  const page = await db.HandlePublicProfile.filter({ published: true }, { sort: 'handle', limit: 12, ...(body.cursor ? { cursor: body.cursor } : {}) });
  const profiles = new Map();
  // Never return private drafts or former-owner content, even during transfers.
  // Bound on-chain work per page and limit concurrent RPC connections.
  for (let offset = 0; offset < page.items.length; offset += 6) {
    const verified = await Promise.all(page.items.slice(offset, offset + 6).map(async row => {
      const current = await resolveOnChain(rpcUrl, row.handle);
      return current?.verified && current.address === row.wallet && current.assetAddress === row.asset
        ? { handle: row.handle, bio: row.bio, social_links: row.social_links } : null;
    }));
    for (const profile of verified) if (profile) profiles.set(profile.handle, profile);
  }
  return Response.json({ items: [...profiles.values()], next_cursor: page.next_cursor || null, has_more: !!page.has_more }, { headers: { 'Cache-Control': 'no-store' } });
}