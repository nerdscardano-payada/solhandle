import { solAmount } from '@/components/solhandle/partner-mint/partnerPilotClient';
export default function PartnerMintQuote({ quote }) {
  if (!quote) return null;
  return <section className="mt-5 rounded-xl border border-names-accent/30 bg-card p-5">
    <h2 className="font-heading text-xl">@{quote.handle}</h2><p className="mt-2 text-sm text-muted-foreground">Approved on-chain partner: {quote.partnerId}</p>
    <dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><dt>Mint fee</dt><dd>{solAmount(quote.mintPriceLamports)} SOL</dd><dt>Partner receives</dt><dd>{solAmount(quote.partnerShareLamports)} SOL</dd><dt>Protocol receives</dt><dd>{solAmount(quote.protocolShareLamports)} SOL</dd></dl>
    <p className="mt-4 text-sm text-muted-foreground">Devnet SOL only. Network fees, account rent and storage are separate. No Earn primary-mint commission.</p>
    <details className="mt-3 text-xs text-muted-foreground"><summary>Verified recipients and collection</summary><div className="mt-2 space-y-2 break-all"><p>Partner wallet: {quote.revenueWallet}</p><p>Treasury: {quote.treasury}</p><p>Collection: {quote.collection}</p><p>Program: {quote.program}</p></div></details>
  </section>;
}