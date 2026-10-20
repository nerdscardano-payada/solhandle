import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import Header from '@/components/solhandle/Header';
import PartnerDevnetProvider from '@/components/solhandle/partner-mint/PartnerDevnetProvider';
import PartnerMintSdkExample from '@/components/solhandle/partner-mint/PartnerMintSdkExample';
import PartnerMintSdkSource from '@/components/solhandle/partner-mint/PartnerMintSdkSource';
import PartnerMintPilotPreparation from '@/components/solhandle/partner-mint/PartnerMintPilotPreparation';
export default function PartnerMintSdkDevnet() {
  const { user } = useAuth(), { search } = useLocation();
  const partnerId = new URLSearchParams(search).get('partner') || 'devnet-testpartner';
  const validPartner = /^[a-z0-9-]{1,32}$/.test(partnerId);
  return <main className="dark min-h-screen bg-background text-foreground"><Header/><div className="mx-auto max-w-3xl px-5 py-10">
    <nav className="flex flex-wrap gap-4 text-sm text-names-accent"><Link to="/developers/partner-mint">← Partner Mint-plan</Link><Link to={`/mint?partner=${encodeURIComponent(partnerId)}`}>Devnet-partnerbeheer</Link></nav>
    <p className="mt-7 text-xs font-semibold uppercase tracking-wider text-names-warning">Fase 2 · SDK-bronversie 1.1.0 · uitsluitend Devnet</p>
    <h1 className="mt-3 font-heading text-3xl font-semibold">Partner Mint SDK</h1>
    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Een echt integratievoorbeeld: beschikbaarheid controleren, kosten bekijken, zelf ondertekenen en de mint opvolgen. De officiële NFT gaat rechtstreeks naar de claimant; de SOL-mintvergoeding wordt atomair 50/50 verdeeld.</p>
    <p className="mt-3 text-sm text-muted-foreground">Gebruik een goedgekeurde Devnet-partner en test-SOL. Geen Mainnet-activering, geen nieuwe beheerdersrechten en geen toegang voor externe partners in deze stap.</p>
    {user?.role !== 'admin' ? <p role="alert" className="mt-6 text-names-warning">Dit Devnet-voorbeeld is uitsluitend beschikbaar voor protocolbeheerders.</p> : !validPartner ? <p role="alert" className="mt-6 text-destructive">Ongeldige partner-ID. Gebruik de link van de goedgekeurde Devnet-partner.</p> : <PartnerDevnetProvider><PartnerMintSdkExample key={partnerId} partnerId={partnerId}/></PartnerDevnetProvider>}
    {user?.role === 'admin' && <PartnerMintPilotPreparation/>}
    <PartnerMintSdkSource/>
  </div></main>;
}