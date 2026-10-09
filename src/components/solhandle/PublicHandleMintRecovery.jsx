import { useWallet } from '@solana/wallet-adapter-react';
import { useLanguage } from '@/components/i18n/LanguageProvider';
import usePublicHandleMint from '@/components/solhandle/usePublicHandleMint';
import PublicHandleMintReceipt from '@/components/solhandle/PublicHandleMintReceipt';
export default function PublicHandleMintRecovery() {
  const { publicKey } = useWallet();
  const { t } = useLanguage();
  const mint = usePublicHandleMint(publicKey?.toBase58() || '');
  return mint.receipt && mint.receipt.status !== 'confirmed' ? <section aria-label={t('Saved token mint')} className="dark mx-5 mt-5"><PublicHandleMintReceipt mint={mint}/></section> : null;
}