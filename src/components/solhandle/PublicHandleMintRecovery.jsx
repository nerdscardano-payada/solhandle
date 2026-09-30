import { useWallet } from '@solana/wallet-adapter-react';
import usePublicHandleMint from '@/components/solhandle/usePublicHandleMint';
import PublicHandleMintReceipt from '@/components/solhandle/PublicHandleMintReceipt';
export default function PublicHandleMintRecovery() {
  const { publicKey } = useWallet();
  const mint = usePublicHandleMint(publicKey?.toBase58() || '');
  return mint.receipt ? <section aria-label="Saved token mint" className="dark mx-5 mt-5"><PublicHandleMintReceipt mint={mint}/></section> : null;
}