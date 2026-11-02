import { useWallet } from '@solana/wallet-adapter-react';
import HandleSearch from '@/components/solhandle/HandleSearch';
import '@/components/solhandle/ecosystem/live/home-hero-mint.css';

export default function HomeHeroMint() {
  const { publicKey } = useWallet();
  return <div className="el-hero-mint"><HandleSearch wallet={publicKey?.toBase58() || ''} personalSearch compact funnel officialClaims hideEmptyHint presentation="ecosystem"/></div>;
}