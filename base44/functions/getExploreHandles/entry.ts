import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const rarityFor = (length) => length === 1 ? 'LEGENDARY' : length === 2 ? 'ULTRA_RARE' : length === 3 ? 'RARE' : length === 4 ? 'UNCOMMON' : 'STANDARD';
const characterTypeFor = (handle) => /^\d+$/.test(handle) ? 'NUMBERS' : /^[a-z]+$/.test(handle) ? 'LETTERS' : 'ALPHANUMERIC';

export default async function(req: Request): Promise<Response> {
  try {
    const input = await req.json();
    const base44 = createClientFromRequest(req);
    const page = Math.max(Number(input.page) || 1, 1);
    const query: Record<string, unknown> = { status: 'active' };
    const handle = String(input.search || '').trim().replace(/^@+/, '').toLowerCase();
    if (handle) query.handle = handle;
    if (input.tab === 'premium') query.name_class = 'Premium';
    if (input.tab === 'short') query.length = { $lte: 4 };
    if (input.rarity) query.rarity = input.rarity;
    if (input.length) query.length = input.length === '5+' ? { $gte: 5 } : Number(input.length);
    if (input.characterType) query.character_type = input.characterType;
    const sort = input.sort === 'oldest' ? 'minted_at' : input.sort === 'shortest' ? 'length' : '-minted_at';
    const records = await base44.asServiceRole.entities.HandleIndex.filter(query, sort, 49, (page - 1) * 48);
    return Response.json({
      handles: records.slice(0, 48).map((record) => ({
        handle: record.handle,
        display: record.display_handle || `@${record.handle}`,
        asset: record.asset_address,
        rarity: record.rarity || rarityFor(record.handle.length),
        nameClass: record.name_class || 'Standard',
        length: record.length || record.handle.length,
        characterType: record.character_type || characterTypeFor(record.handle),
        mintedAt: record.minted_at
      })),
      page,
      hasMore: records.length > 48
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}