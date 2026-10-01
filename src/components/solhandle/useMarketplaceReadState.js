import { useCallback, useEffect, useState } from 'react';

const eventName = 'solhandle-marketplace-read';
const storageKey = wallet => `solhandle_marketplace_read:${wallet}`;
const readKeys = wallet => wallet ? JSON.parse(localStorage.getItem(storageKey(wallet)) || '[]') : [];
const notificationKeys = (bids, sales) => [
  ...bids.map(bid => `bid:${bid.id}:${bid.transaction_signature || bid.created_at || ''}:${bid.amount_lamports}`),
  ...sales.map(sale => `sale:${sale.id}:${sale.closed_signature || sale.closed_at || ''}`)
];

export default function useMarketplaceReadState(wallet, bids, sales) {
  const [state, setState] = useState(() => ({ wallet, keys: readKeys(wallet) }));
  const keys = state.wallet === wallet ? state.keys : readKeys(wallet);
  const seen = new Set(keys);
  const count = notificationKeys(bids, sales).filter(key => !seen.has(key)).length;
  useEffect(() => {
    const sync = () => setState({ wallet, keys: readKeys(wallet) });
    sync();
    const onStorage = event => { if (event.key === storageKey(wallet) || event.key === null) sync(); };
    const onRead = event => { if (event.detail === wallet) sync(); };
    window.addEventListener('storage', onStorage);
    window.addEventListener(eventName, onRead);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(eventName, onRead);
    };
  }, [wallet]);
  const markRead = useCallback(() => {
    if (!wallet) return;
    const previous = readKeys(wallet), seen = new Set(previous);
    const unread = notificationKeys(bids, sales).filter(key => !seen.has(key));
    if (!unread.length) return;
    const next = [...new Set([...previous, ...unread])];
    localStorage.setItem(storageKey(wallet), JSON.stringify(next));
    setState({ wallet, keys: next });
    window.dispatchEvent(new CustomEvent(eventName, { detail: wallet }));
  }, [wallet, bids, sales]);
  return { count, markRead };
}