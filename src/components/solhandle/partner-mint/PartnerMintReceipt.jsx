import { Button } from '@/components/ui/button';
export default function PartnerMintReceipt({ record, busy, onCheck, onRetry, onClear }) {
  if (!record) return null;
  const terminal = ['FINALIZED', 'FAILED'].includes(record.status) || (record.status === 'EXPIRED' && (!record.signature || record.expiredWithoutReceiptVerified));
  return <section className="mt-5 rounded-xl border border-names-secondary/30 bg-card p-5">
    <h2 className="text-xl font-heading">@{record.handle} · {record.status}</h2>
    <p className="mt-2 text-sm text-muted-foreground">{terminal ? 'Devnet result saved. This is not a mainnet asset.' : 'A signed mint is saved locally. Check this intent before creating another mint.'}</p>
    {record.signature && <a className="mt-3 block break-all text-sm text-names-accent underline" target="_blank" rel="noreferrer" href={`https://explorer.solana.com/tx/${record.signature}?cluster=devnet`}>View Devnet transaction</a>}
    {record.receipt && <div className="mt-3 space-y-2 break-all text-sm"><p>Original owner: {record.receipt.originalOwner}</p><p>Partner: {record.receipt.partnerId}</p><p>{record.receipt.countsAsFinalizedRevenue ? 'Finalized receipt verified.' : 'Confirmed receipt verified; finalization pending.'}</p><a className="text-names-accent underline" target="_blank" rel="noreferrer" href={`https://explorer.solana.com/address/${record.receipt.assetAddress}?cluster=devnet`}>View official asset</a></div>}
    <div className="mt-4 flex flex-wrap gap-3"><Button disabled={busy} onClick={onCheck}>Check status</Button>{!terminal && record.signedTransaction && <Button disabled={busy} variant="outline" onClick={onRetry}>Relay same signed transaction</Button>}{terminal && <Button disabled={busy} variant="outline" onClick={onClear}>Start another Devnet mint</Button>}</div>
  </section>;
}