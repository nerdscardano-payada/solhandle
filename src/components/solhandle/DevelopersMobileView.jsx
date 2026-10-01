import { Link } from 'react-router-dom';
import ResolverDemo from '@/components/solhandle/ResolverDemo';
import DeveloperIntegrationTabs from '@/components/solhandle/DeveloperIntegrationTabs';
import ResolutionGuide from '@/components/solhandle/ResolutionGuide';
import ResolutionStatus from '@/components/solhandle/ResolutionStatus';

export default function DevelopersMobileView() {
  return <div className="dark sm:hidden">
    <div className="flex items-center justify-between gap-2"><h1 className="font-heading text-2xl font-semibold">Developers</h1><span className="rounded-full border border-names-success/25 px-2 py-1 text-[10px] text-names-success">Mainnet live</span></div>
    <p className="mt-2 text-xs text-muted-foreground">Resolve @handles to their current NFT owner.</p>
    <ResolverDemo />
    <div className="mt-4 grid grid-cols-2 gap-3"><Link to="/integrations" className="rounded-xl border border-names-accent/25 p-3 text-center text-sm font-semibold text-names-accent">Product guides →</Link><Link to="/protocol-paper" className="rounded-xl border border-names-secondary/25 p-3 text-center text-sm font-semibold text-names-secondary">Protocol Paper →</Link></div>
    <div className="mt-4 space-y-3">
      <details className="rounded-xl border border-border bg-card p-3"><summary className="cursor-pointer text-sm font-semibold text-names-accent">Implementation · SDK / REST / On-chain</summary><DeveloperIntegrationTabs /></details>
      <details className="rounded-xl border border-border bg-card p-3"><summary className="cursor-pointer text-sm font-semibold text-names-accent">Quickstart & protocol reference</summary><p className="mt-3 text-xs leading-relaxed text-muted-foreground">Source of truth: Solana program → HandleRecord → verified Metaplex Core Asset → current owner. The API is only a convenience layer. SolHandle never holds funds or routes transactions.</p><ResolutionGuide /></details>
      <details className="rounded-xl border border-border bg-card p-3"><summary className="cursor-pointer text-sm font-semibold text-names-success">Current integration status</summary><ResolutionStatus /></details>
      <details className="rounded-xl border border-burn-highlight/25 bg-card p-3"><summary className="cursor-pointer text-sm font-semibold text-burn-highlight">Native SOL · safety requirements</summary><p className="mt-3 text-xs leading-relaxed text-muted-foreground">A verified handle is not automatically a safe payment destination. Integrations must also confirm that the current owner is a System Program wallet or an unfunded on-curve address. Program-owned accounts and PDAs are blocked by the resolver’s safety result.</p></details>
    </div>
  </div>;
}