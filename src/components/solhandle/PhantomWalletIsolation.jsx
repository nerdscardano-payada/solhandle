import { useMemo } from 'react';
import { WalletContext, useWallet } from '@solana/wallet-adapter-react';
import { pinnedPhantomName } from '@/lib/PinnedPhantomAdapter';
import { requestWalletConnection } from '@/lib/walletConnectionPolicy';

const displayAdapters = new WeakMap();
export default function PhantomWalletIsolation({ children }) {
  const session = useWallet();
  const value = useMemo(() => {
    const pinned = session.wallets.find(({ adapter }) => adapter.name === pinnedPhantomName);
    if (!pinned) return session; // Native Android retains its Wallet Standard bridge.
    if (!displayAdapters.has(pinned.adapter)) displayAdapters.set(pinned.adapter, new Proxy(pinned.adapter, {
      get(target, key) {
        if (key === 'name') return 'Phantom';
        const value = Reflect.get(target, key, target);
        return typeof value === 'function' ? value.bind(target) : value;
      },
    }));
    const displayWallet = { ...pinned, adapter: displayAdapters.get(pinned.adapter) };
    return {
      ...session,
      wallets: session.wallets.filter(({ adapter }) => adapter.name !== 'Phantom')
        .map(item => item === pinned ? displayWallet : item),
      wallet: session.wallet?.adapter === pinned.adapter ? displayWallet : session.wallet,
      select: name => {
        const internalName = name === 'Phantom' ? pinnedPhantomName : name;
        if (internalName) requestWalletConnection(internalName);
        session.select(internalName);
      },
    };
  }, [session]);
  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}