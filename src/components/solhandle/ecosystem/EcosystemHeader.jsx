import { Search, Wallet, UserRound, ChevronDown, ArrowRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { ecosystemAssets } from '@/components/solhandle/ecosystem/previewData';
import { useEcosystem } from '@/components/solhandle/ecosystem/EcosystemContext';
export default function EcosystemHeader() {
  const d = useEcosystem();
  const search = event => { event.preventDefault(); d.setCategory('All'); d.go('discover'); };
  return <header className="ep-header">
    <button className="ep-brand" onClick={() => d.go('public')} aria-label="SolHandle public homepage preview"><Image src={ecosystemAssets.logo} alt="" fittingType="fit" className="ep-logo" loading="eager"/><span>SolHandle<small>ONE IDENTITY. ONE ECOSYSTEM.</small></span></button>
    <form onSubmit={search} className="ep-global-search"><Search size={18}/><input value={d.search} onChange={event => d.setSearch(event.target.value)} maxLength={80} aria-label="Search demo handles, people or Solana projects" placeholder="Search handles, people or Solana projects..."/><button type="submit" aria-label="Search"><ArrowRight size={17}/></button></form>
    <div className="ep-header-actions"><button className="ep-icon ep-mobile-search" aria-label="Search ecosystem" onClick={() => { d.setCategory('All'); d.go('discover'); }}><Search size={20}/></button><button className="ep-wallet" onClick={() => d.setModal({ type: 'account' })}><span className="ep-mini-avatar"><UserRound size={17}/></span><span>{d.wallet ? d.handle || 'Wallet connected' : 'Connect Wallet'}<small>{!d.wallet ? 'Demo connection' : d.scenario === 'unsigned' ? 'Not signed in · demo' : 'Example account · demo'}</small></span><ChevronDown size={15}/><Wallet className="ep-wallet-icon" size={18}/></button></div>
  </header>;
}