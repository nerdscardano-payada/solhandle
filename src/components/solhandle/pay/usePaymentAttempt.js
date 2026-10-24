import { useWallet } from '@solana/wallet-adapter-react';
import useIdentityAttempt from '@/components/solhandle/network/lab/useIdentityAttempt';

export default function usePaymentAttempt() {
  const wallet = useWallet();
  const address = wallet.publicKey?.toBase58() || '';
  return useIdentityAttempt({ actorId: address, address, adapter: wallet.wallet?.adapter, connected: wallet.connected });
}