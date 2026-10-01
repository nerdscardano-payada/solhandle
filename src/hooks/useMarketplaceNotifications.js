import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import invokeWithRetry from '@/lib/invokeWithRetry';

export default function useMarketplaceNotifications(wallet, handles = []) {
  const client = useQueryClient();
  const assetsKey = handles.map(item => item.asset || item.asset_address).filter(Boolean).sort().join(',');
  const owner = useQuery({
    queryKey: ['notification-owner', wallet],
    queryFn: async () => (await invokeWithRetry('getOwnerHandles', { wallet })).data,
    enabled: Boolean(wallet) && !assetsKey, staleTime: 60000, retry: false
  });
  const assets = assetsKey ? assetsKey.split(',') : (owner.data?.handles || []).map(item => item.asset).filter(Boolean);
  const notifications = useQuery({
    queryKey: ['market-notifications', wallet, assets.join(',')],
    enabled: Boolean(wallet) && (Boolean(assetsKey) || owner.isSuccess), staleTime: 30000, retry: false,
    queryFn: async () => {
      const [bids, sales] = await Promise.all([
        assets.length ? base44.entities.NativeBid.filter({ status: 'ACTIVE', asset_address: { $in: assets } }, { sort: '-amount_lamports', limit: 50 }) : { items: [] },
        base44.entities.NativeListing.filter({ seller: wallet, status: 'CLOSED' }, { sort: '-closed_at', limit: 25 })
      ]);
      return { bids: bids.items, sales: sales.items };
    }
  });
  useEffect(() => {
    if (!wallet) return;
    let timer;
    const refresh = () => {
      clearTimeout(timer);
      timer = setTimeout(() => client.invalidateQueries({ queryKey: ['market-notifications', wallet] }), 500);
    };
    const stopBids = base44.entities.NativeBid.subscribe(refresh);
    const stopListings = base44.entities.NativeListing.subscribe(refresh);
    return () => { clearTimeout(timer); stopBids(); stopListings(); };
  }, [wallet, client]);
  return { bids: wallet ? notifications.data?.bids || [] : [], sales: wallet ? notifications.data?.sales || [] : [], error: owner.error || notifications.error,
    refresh: () => client.invalidateQueries({ queryKey: ['market-notifications', wallet] }) };
}