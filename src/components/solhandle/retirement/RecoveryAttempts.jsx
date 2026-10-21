import { formatRecoverySol } from '@/components/solhandle/retirement/recoveryStorage';
export default function RecoveryAttempts({ attempts, busy, check, retry }) {
  if (!attempts.length) return null;
  return <section className="mt-8"><h2 className="text-xl font-semibold">Saved cancellation attempts</h2><p className="mt-2 text-sm text-muted-foreground">Saved on this browser before broadcast. Keep this browser data until your cancellation is finalized; save the transaction signature as well.</p><div className="mt-4 space-y-3">{attempts.map(attempt => <article key={attempt.signature} className="rounded-xl border border-border bg-card p-4">
    <p className="font-medium">@{attempt.handle} · {attempt.state === 'finalized' ? 'Finalized on Mainnet' : attempt.state === 'expired' ? 'Expired without a detected transaction · refresh positions before signing again' : attempt.state === 'failed' ? 'Failed on-chain · network fees may apply' : 'Pending / checking broadcast'}</p>
    <a href={`https://explorer.solana.com/tx/${attempt.signature}`} target="_blank" rel="noopener noreferrer" className="mt-2 block break-all text-xs text-names-accent">{attempt.signature}</a>
    {attempt.returnedLamports != null && <p className="mt-2 text-sm">Verified wallet return before network fee: {formatRecoverySol(attempt.returnedLamports)} SOL</p>}
    {attempt.error && <p className="mt-2 text-sm text-names-warning">{attempt.error}</p>}
    {attempt.state !== 'finalized' && <div className="mt-3 flex flex-wrap gap-4"><button disabled={Boolean(busy)} className="text-sm text-names-accent underline disabled:opacity-50" onClick={() => check(attempt)}>Check signature</button>{attempt.state === 'pending' && <button disabled={Boolean(busy)} className="text-sm text-names-accent underline disabled:opacity-50" onClick={() => retry(attempt)}>Check & rebroadcast same signed cancellation</button>}</div>}
  </article>)}</div></section>;
}