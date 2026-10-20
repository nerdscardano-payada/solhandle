import { useWallet } from '@solana/wallet-adapter-react';
import { base44 } from '@/api/base44Client';
import useSolHandleMint from '@/components/solhandle/partner-mint/react/useSolHandleMint';
export default function usePartnerMintSdkExample(partnerId) {
  const wallet = useWallet();
  return useSolHandleMint({ partnerId, wallet, invoke: (name, payload) => base44.functions.invoke(name, payload) });
}