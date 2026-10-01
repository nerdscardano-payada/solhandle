import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function useMarketplacePage({ search, maxPrice, rarity, sort }) {
  const [term, setTerm] = useState(search), [navigation, setNavigation] = useState(null);
  useEffect(() => { const timer = setTimeout(() => setTerm(search), 250); return () => clearTimeout(timer); }, [search]);
  const key = JSON.stringify([term, maxPrice, rarity, sort]);
  const nav = navigation?.key === key ? navigation : { key, index: 0, cursors: [null] };
  const query = { status: 'ACTIVE' };
  const clean = term.toLowerCase().replace(/^@/, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (clean) query.handle = { $regex: clean };
  if (maxPrice) query.price_lamports = { $lte: Number(maxPrice) * 1e9 };
  const lengths = { LEGENDARY: '^.{1}$', ULTRA_RARE: '^.{2}$', RARE: '^.{3}$', UNCOMMON: '^.{4}$', STANDARD: '^.{5,20}$' };
  if (lengths[rarity]) query.$and = [{ handle: { $regex: lengths[rarity] } }];
  const listings = useQuery({ queryKey: ['market-page', 'paged-16', key, nav.index], queryFn: async () => {
    const cursor = nav.cursors[nav.index];
    if (!sort.startsWith('length-')) return base44.entities.NativeListing.filter(query, { limit: 16, cursor: cursor || undefined, sort: { oldest: 'created_at', 'price-asc': 'price_lamports', 'price-desc': '-price_lamports' }[sort] || '-created_at' });
    const step = sort === 'length-desc' ? -1 : 1;
    let length = cursor?.length || (step === 1 ? 1 : 20), position = cursor?.cursor, items = [];
    while (length >= 1 && length <= 20 && items.length < 16) {
      const page = await base44.entities.NativeListing.filter({ ...query, $and: [...(query.$and || []), { handle: { $regex: `^.{${length}}$` } }] }, { sort: '-created_at', limit: 16 - items.length, cursor: position || undefined });
      items.push(...page.items);
      if (page.has_more) return { items, has_more: true, next_cursor: { length, cursor: page.next_cursor } };
      length += step; position = undefined;
    }
    return { items, has_more: length >= 1 && length <= 20, next_cursor: { length } };
  }});
  const stats = useQuery({ queryKey: ['market-stats'], queryFn: () => base44.entities.NativeListing.aggregate({ query: { status: 'ACTIVE' }, min: 'price_lamports' }) });
  const refresh = () => { listings.refetch(); stats.refetch(); };
  return { listings: listings.data?.items || [], loading: listings.isPending, error: listings.error, busy: listings.isFetching,
    floor: stats.data?.rows?.[0]?.min_price_lamports, total: stats.data?.rows?.[0]?.count,
    page: nav.index + 1, hasNext: Boolean(listings.data?.has_more), refresh,
    onPrevious: () => setNavigation({ ...nav, index: nav.index - 1 }),
    onNext: () => setNavigation({ ...nav, index: nav.index + 1, cursors: [...nav.cursors.slice(0, nav.index + 1), listings.data.next_cursor] }) };
}