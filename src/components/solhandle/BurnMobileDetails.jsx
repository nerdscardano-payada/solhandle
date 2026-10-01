import { Link } from 'react-router-dom';

export default function BurnMobileDetails() {
  return <details className="mt-4 rounded-xl border border-burn-accent/20 bg-card p-3 sm:hidden">
    <summary className="cursor-pointer text-sm font-semibold text-burn-accent">Burn sources & how it works</summary>
    <div className="mt-4 space-y-4 text-xs leading-relaxed text-muted-foreground">
      <div><h2 className="font-semibold text-burn-accent">Automatic mint burns · 50%</h2><p className="mt-2">A successful mint paid in $HANDLE burns half of the token payment. The remainder goes to the treasury. Burn, payment and NFT mint happen in one atomic transaction.</p><Link to="/growth/handle-mint-payments" className="mt-3 inline-block text-burn-highlight underline">Mint payment status & details →</Link></div>
      <div><h2 className="font-semibold text-burn-secondary">Growth & other recorded burns</h2><p className="mt-2">Confirmed burns recorded by the protocol team appear here too. Growth-cycle burns are labelled by cycle when linked. Reaching a milestone alone does not execute a burn.</p><p className="mt-2">Buybacks and other rewards remain separate in Flywheel.</p></div>
      <p>Totals cover recorded, confirmed burns of the official $HANDLE token, not every burn on Solana. Mint burns appear after confirmation and processing; other burns appear after on-chain verification and registration. Tokens are destroyed, not sent to a burn wallet. Treasury receipts are not burns.</p>
    </div>
  </details>;
}