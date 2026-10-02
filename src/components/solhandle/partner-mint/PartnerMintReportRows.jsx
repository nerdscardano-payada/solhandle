import { solAmount } from '@/components/solhandle/partner-mint/partnerPilotClient';
export default function PartnerMintReportRows({ receipts }) {
  if (!receipts.length) return <p className="mt-5 text-sm text-muted-foreground">No finalized receipts indexed yet. Use Recover saved mints to recheck earlier submitted mints on-chain.</p>;
  return <div className="mt-5 space-y-3">{receipts.map(receipt => <article key={receipt.id} className="rounded-lg border border-border p-4">
    <div className="flex flex-wrap justify-between gap-2"><h3 className="font-heading font-semibold">@{receipt.handle}</h3><span className="text-xs text-names-success">FINALIZED · split verified</span></div>
    <p className="mt-2 text-sm text-muted-foreground">Fee: {solAmount(receipt.mint_price_raw)} SOL · Partner: {solAmount(receipt.partner_share_raw)} SOL · Protocol: {solAmount(receipt.protocol_share_raw)} SOL</p>
    <p className="mt-2 break-all text-xs text-muted-foreground">Original owner: {receipt.original_owner}</p>
    <p className="mt-2 text-xs text-muted-foreground">{new Date(receipt.minted_at).toLocaleString()} · No Earn primary-mint commission</p>
    <a className="mt-3 inline-block text-sm text-names-accent underline" href={`https://explorer.solana.com/tx/${receipt.signature}?cluster=devnet`} target="_blank" rel="noreferrer">View Devnet transaction</a>
  </article>)}</div>;
}