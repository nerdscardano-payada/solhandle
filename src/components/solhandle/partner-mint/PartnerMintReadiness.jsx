import { Link } from 'react-router-dom';
export default function PartnerMintReadiness() {
  return <section className="mt-8 rounded-xl border border-names-warning/30 bg-card p-5"><h2 className="font-heading text-lg">Phase 1 acceptance gates</h2>
    <p className="mt-3 text-sm text-muted-foreground">The additional Devnet administration, cost review, recovery and activity tools are implemented. A successful mint and backend simulations do not certify the whole phase.</p>
    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground"><li>Pending: real authority / revenue-wallet joint signing and Phantom, Backpack and Solflare acceptance.</li><li>Pending: complete security, simultaneous-claim and unchanged legacy-flow regression evidence.</li><li>Pending: independent program review and deployed-artifact verification.</li></ul>
    <p className="mt-4 text-sm text-names-warning">Partner Mint Mainnet has not been enabled or upgraded. Complete Phase 1, then Phase 2 and Phase 3 before requesting Mainnet approval.</p>
    <Link className="mt-3 inline-block text-sm text-names-accent underline" to="/developers/partner-mint">Review the full acceptance matrix</Link>
  </section>;
}