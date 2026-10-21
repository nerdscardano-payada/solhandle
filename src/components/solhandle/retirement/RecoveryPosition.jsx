import { formatRecoverySol } from '@/components/solhandle/retirement/recoveryStorage';
export default function RecoveryPosition({ position, attempts, busy, cancel }) {
  const blocked = attempts.some(a => a.position === position.position && a.state === 'pending');
  const isBid = position.action === 'cancel_bid';
  return <article className="rounded-xl border border-border bg-card p-5">
    <h3 className="font-semibold">{position.handle ? `@${position.handle}` : position.asset} · {isBid ? 'Legacy bid' : 'Legacy listing'}</h3>
    <p className="mt-2 text-sm text-muted-foreground">{isBid ? `Bid principal: ${formatRecoverySol(position.amountLamports)} SOL` : 'Cancel the listing and revoke its marketplace transfer permission. The NFT stays in your wallet.'}</p>
    <p className="mt-2 text-sm">{isBid ? 'Account rent / excess' : 'Listing account balance'}: {formatRecoverySol(position.rentLamports)} SOL</p>
    <a href={`https://explorer.solana.com/address/${position.position}`} target="_blank" rel="noopener noreferrer" className="mt-2 block break-all text-xs text-names-accent">{position.position}</a>
    {position.validationError && <p role="alert" className="mt-3 text-sm text-names-warning">{position.validationError}</p>}
    <button disabled={Boolean(busy || blocked || position.validationError)} onClick={() => cancel(position)} className="mt-4 rounded-lg bg-button-primary px-4 py-2 text-sm font-semibold text-button-foreground disabled:opacity-50">{blocked ? 'Check saved cancellation below' : isBid ? 'Cancel bid & return SOL' : 'Cancel listing'}</button>
  </article>;
}