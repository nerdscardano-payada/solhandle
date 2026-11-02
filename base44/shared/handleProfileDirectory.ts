import { resolveOnChain } from './solhandleResolver.ts';
import { handleProfileArtwork } from './handleProfileArtwork.ts';
import { handleProfilePrimary } from './handleProfilePrimary.ts';
export async function handleProfileDirectory(db, rpcUrl, body) {
  if (body.cursor !== undefined && (typeof body.cursor !== 'string' || !body.cursor.trim() || body.cursor.length > 2048)) return Response.json({ error: 'Invalid profile cursor.' }, { status: 400 });
  if (body.q !== undefined && (typeof body.q !== 'string' || body.q.length > 80)) return Response.json({ error: 'Invalid people search.' }, { status: 400 });
  const term = (body.q || '').trim().replace(/^@/, '');
  const pattern = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const query = { published: true, ...(term ? { $or: [{ handle: { $regex: pattern, $options: 'i' } }, { bio: { $regex: pattern, $options: 'i' } }] } : {}) };
  const page = await db.HandlePublicProfile.filter(query, { sort: 'handle', limit: 12, ...(body.cursor ? { cursor: body.cursor } : {}) });
  const profiles = new Map();
  // Never return private drafts or former-owner content, even during transfers.
  // Bound on-chain work per page and limit concurrent RPC connections.
  for (let offset = 0; offset < page.items.length; offset += 6) {
    const verified = await Promise.all(page.items.slice(offset, offset + 6).map(async row => {
      const current = await resolveOnChain(rpcUrl, row.handle);
      return current?.verified && current.address === row.wallet && current.assetAddress === row.asset
        ? { handle: row.handle, bio: row.bio, social_links: row.social_links, avatar: row.avatar || null, assetAddress: current.assetAddress, owner: current.address, ownershipChecked: true } : null;
    }));
    for (const profile of verified) if (profile) profiles.set(profile.handle, profile);
  }
  const selection = body.include_mint_artwork === true && body.variant !== 'directory' ? [...profiles.values()].slice(0, 6) : [...profiles.values()];
  const primaryProfiles = await handleProfilePrimary(rpcUrl, selection);
  const items = body.include_mint_artwork === true
    ? await handleProfileArtwork(rpcUrl, primaryProfiles)
    : primaryProfiles.map(({ owner, assetAddress, ...profile }) => profile);
  return Response.json({ items, next_cursor: page.next_cursor || null, has_more: !!page.has_more }, { headers: { 'Cache-Control': 'no-store' } });
}