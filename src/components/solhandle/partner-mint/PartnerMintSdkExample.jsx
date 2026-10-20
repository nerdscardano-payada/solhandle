import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { base44 } from '@/api/base44Client';
import SolHandleMint from '@/components/solhandle/partner-mint/react/SolHandleMint';
export default function PartnerMintSdkExample({ partnerId }) {
  const wallet = useWallet(), { setVisible } = useWalletModal();
  return <SolHandleMint partnerId={partnerId} cluster="devnet" wallet={wallet}
    invoke={(name, payload) => base44.functions.invoke(name, payload)}
    onConnect={() => setVisible(true)} onDisconnect={() => wallet.disconnect()} className="mt-7"/>;
}