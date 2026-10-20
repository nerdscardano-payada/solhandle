import { useMemo, useRef } from 'react';
import { WalletContext, useWallet } from '@solana/wallet-adapter-react';
import signConnectedMessage from '@/lib/signConnectedMessage';
import { requestWalletConnection } from '@/lib/walletConnectionPolicy';

export default function WalletSessionGuard({ children }) {
  const session = useWallet();
  const current = useRef(session);
  current.current = session;
  const value = useMemo(() => {
    const adapter = session.wallet?.adapter;
    const address = session.publicKey?.toBase58();
    const assertCurrent = () => {
      const active = current.current;
      if (!session.connected || !active.connected || active.wallet?.adapter !== adapter ||
        active.publicKey?.toBase58() !== address || adapter?.publicKey?.toBase58() !== address) {
        throw new Error('Your wallet connection changed. Reconnect the same wallet before continuing.');
      }
    };
    const guard = (method, invoke = method) => method && (async (...args) => {
      assertCurrent();
      const result = await invoke(...args);
      assertCurrent();
      return result;
    });
    return {
      ...session,
      signMessage: guard(session.signMessage, message => signConnectedMessage(session, message)),
      signTransaction: guard(session.signTransaction),
      signAllTransactions: guard(session.signAllTransactions),
      sendTransaction: guard(session.sendTransaction),
      // Changing wallet is an explicit disconnect/reconnect, never part of an action.
      select: name => {
        if ((current.current.connected || current.current.connecting) && name !== current.current.wallet?.adapter.name) return;
        if (name) requestWalletConnection(name);
        session.select(name);
      },
    };
  }, [session]);
  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}