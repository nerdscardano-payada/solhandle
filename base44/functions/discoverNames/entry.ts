import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { secrets } from 'base44:runtime';
import { verifyNamesWallet } from '../../shared/namesAuthorization.ts';
import { namesInterest, interestFor } from '../../shared/namesInterest.ts';
import { namesChain } from '../../shared/namesChain.ts';
import { getFallbackSuggestions } from '../../shared/handleSuggestionPool.ts';
export default async function(req: Request): Promise<Response> {
  try {
    const input = await req.json(), base44 = createClientFromRequest(req);
    const tab = String(input.tab || 'trending');
    if (!['trending', 'available', 'owned', 'for-sale', 'watchlist'].includes(tab)) return Response.json({ error: 'Invalid Names tab.' }, { status: 400 });
    const search = String(input.search || '').trim().replace(/^@+/, '').toLowerCase();
    if (search && !/^[a-z0-9]{1,20}$/.test(search)) return Response.json({ error: 'Use up to 20 letters or numbers.' }, { status: 400 });
    const query = search ? { handle: { $regex: search } } : {};
    let handles = [], interest, nextCursor = null, hasMore = false;
    if (tab === 'owned' || tab === 'watchlist' || tab === 'for-sale') {
      let page;
      if (tab === 'for-sale') {
        page = await base44.asServiceRole.entities.NativeListing.filter({ ...query, status: 'ACTIVE' }, { sort: '-created_at', limit: 24, cursor: input.cursor || undefined, fields: ['handle'] });
      } else if (tab === 'watchlist') {
        const wallet = await verifyNamesWallet(input.proof);
        page = await base44.asServiceRole.entities.NameWatch.filter({ ...query, wallet }, { sort: '-watched_at', limit: 24, cursor: input.cursor || undefined, fields: ['handle'] });
      } else {
        const allowedRarities = ['LEGENDARY', 'ULTRA_RARE', 'RARE', 'UNCOMMON', 'STANDARD'];
        const allowedTypes = ['LETTERS', 'NUMBERS', 'ALPHANUMERIC'];
        if (allowedRarities.includes(input.rarity)) query.rarity = input.rarity;
        if (allowedTypes.includes(input.characterType)) query.character_type = input.characterType;
        if (input.preset === 'premium') query.name_class = 'Premium';
        if (input.preset === 'short') query.length = { $lte: 4 };
        const sort = input.sort === 'oldest' ? 'minted_at' : input.sort === 'shortest' ? 'length' : '-minted_at';
        page = await base44.asServiceRole.entities.HandleIndex.filter({ ...query, status: 'active' }, { sort, limit: 24, cursor: input.cursor || undefined, fields: ['handle'] });
      }
      handles = page.items.map(r => r.handle); nextCursor = page.next_cursor; hasMore = page.has_more;
      interest = handles.length ? await namesInterest(base44, { handle: { $in: handles } }) : null;
    } else {
      interest = await namesInterest(base44, query, input.rank === 'watched' ? 'watched' : 'searches');
      handles = interest.ranked.filter(h => /^[a-z0-9]{1,20}$/.test(h));
    }
    let items = await namesChain(base44, secrets.get('SOLANA_RPC_URL'), handles);
    if (tab === 'available') items = items.filter(i => i.status === 'AVAILABLE');
    if (tab === 'for-sale') items = items.filter(i => i.status === 'FOR_SALE');
    if (tab === 'owned') items = items.filter(i => ['OWNED', 'FOR_SALE'].includes(i.status));
    if (!items.length && ['trending', 'available'].includes(tab)) {
      const candidates = getFallbackSuggestions().map(row => row.handle).filter(handle => !search || handle.includes(search));
      const checked = await namesChain(base44, secrets.get('SOLANA_RPC_URL'), candidates);
      items = checked.filter(item => tab === 'available' ? item.status === 'AVAILABLE' : ['AVAILABLE', 'OWNED', 'FOR_SALE'].includes(item.status)).map(item => ({ ...item, suggested: true }));
      if (items.length) interest = await namesInterest(base44, { handle: { $in: items.map(item => item.handle) } });
    }
    items = items.slice(0, 24).map(i => ({ ...i, ...interestFor(interest, i.handle) }));
    return Response.json({ items, next_cursor: nextCursor, has_more: hasMore, ranked: tab === 'trending' || tab === 'available', windowDays: 30 });
  } catch (error) {
    return Response.json({ error: error.message || 'Names could not be loaded.' }, { status: 400 });
  }
}