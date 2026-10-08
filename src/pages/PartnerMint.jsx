import { Link } from 'react-router-dom';
import Header from '@/components/solhandle/Header';
import { useAuth } from '@/lib/AuthContext';
import PartnerDevnetProvider from '@/components/solhandle/partner-mint/PartnerDevnetProvider';
import PartnerMintCheckout from '@/components/solhandle/partner-mint/PartnerMintCheckout';
import PartnerRegistryAdmin from '@/components/solhandle/partner-mint/PartnerRegistryAdmin';
import PartnerMintReadiness from '@/components/solhandle/partner-mint/PartnerMintReadiness';
export default function PartnerMint() {
  const { user } = useAuth();
  return <main className="dark min-h-screen bg-background text-foreground"><Header/><section className="mx-auto max-w-2xl px-5 py-12">
    <Link to="/developers/partner-mint" className="text-sm text-names-accent">← Partner Mint plan</Link>
    <p className="mt-8 text-xs font-semibold uppercase tracking-wider text-names-warning">Devnet only · administrator pilot</p>
    <h1 className="mt-3 font-heading text-3xl">Partner Mint</h1>
    <p className="mt-4 text-sm text-muted-foreground">Use a wallet set to Solana Devnet and test SOL. One atomic mint, 50% of the mint fee to the approved partner and 50% to the protocol. No Mainnet transactions or production indexing.</p>
    {user?.role === 'admin' ? <PartnerDevnetProvider><PartnerMintCheckout /><PartnerRegistryAdmin /><PartnerMintReadiness /></PartnerDevnetProvider> : <p className="mt-6" role="alert">This Devnet pilot is restricted to protocol administrators.</p>}
  </section></main>;
}