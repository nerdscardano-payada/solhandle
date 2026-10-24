import { useRef } from 'react';

export default function useNetworkWalletContext(userId, wallet) {
  const address = wallet.publicKey?.toBase58() || '';
  const adapter = wallet.wallet?.adapter;
  const previous = useRef(null);
  const context = previous.current;
  if (!context || context.userId !== userId || context.address !== address || context.adapter !== adapter || context.connected !== wallet.connected) {
    previous.current = { userId, address, adapter, connected: wallet.connected, generation: (context?.generation || 0) + 1 };
  }
  return `${userId || 'anonymous'}:${previous.current.generation}`;
}