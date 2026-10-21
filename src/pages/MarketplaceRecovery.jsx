import { Link } from 'react-router-dom';
import Header from '@/components/solhandle/Header';
import useMarketplaceRecovery from '@/components/solhandle/retirement/useMarketplaceRecovery';
import RecoveryPosition from '@/components/solhandle/retirement/RecoveryPosition';
import RecoveryAttempts from '@/components/solhandle/retirement/RecoveryAttempts';
import { formatRecoverySol } from '@/components/solhandle/retirement/recoveryStorage';
export default function MarketplaceRecovery() {
  const state = useMarketplaceRecovery();
  return <main className="dark min-h-screen bg-background text-foreground"><div className="mx-auto max-w-7xl"><Header/><section className="mx-auto max-w-4xl px-5 py-8">
    <p className="text-xs uppercase tracking-widest text-names-accent">Solana Mainnet · cancellation only</p>
    <h1 className="mt-3 text-3xl font-semibold">Marketplace Recovery</h1>
    <p className="mt-4 text-muted-foreground">Native trading through SolHandle is retired. Connect the wallet that created your listing or bid to cancel it. SOL returns under the existing contract rules, never through an administrator wallet. Each cancellation requires your wallet signature; network fees apply.</p>
    <p className="mt-3 text-sm text-muted-foreground">Keep a small SOL balance in this same wallet to pay cancellation fees. Listing rent and bid refunds are returned only after cancellation succeeds, so they cannot cover the upfront fee. SolHandle does not currently sponsor recovery fees.</p>
    <div className="mt-5 rounded-xl border border-names-warning/30 p-4 text-sm"><p>Existing on-chain listings can still be purchased directly by others until cancelled. The contract remains permissionless and has not been upgraded or frozen.</p><p className="mt-2">Recovery remains available for outstanding positions, including expired bids. No withdrawal deadline has been imposed.</p></div>
    <div className="my-5 flex flex-wrap gap-5 text-sm"><Link to="/names?tab=for-sale" className="text-names-accent underline">Discover names</Link><Link to="/contact" className="text-names-accent underline">Recovery support</Link><Link to="/my-handles" className="text-names-accent underline">My handles</Link></div>
    {!state.wallet ? <p className="rounded-xl border border-border p-5">Connect your wallet above. No SolHandle email account is required.</p> : <>
      <p className="break-all text-xs text-muted-foreground">Connected wallet: {state.wallet}</p>
      <button disabled={Boolean(state.loading || state.busy)} onClick={state.refresh} className="my-4 text-sm text-names-accent underline disabled:opacity-50">{state.loading ? 'Checking finalized Mainnet state…' : 'Refresh live positions'}</button>
      {state.error && <p role="alert" className="mb-4 rounded-lg border border-destructive p-4 text-sm text-names-warning">{state.error}</p>}
      {state.checkedAt && <p className="mb-4 text-xs text-muted-foreground">Checked: {new Date(state.checkedAt).toLocaleString()} · finalized scan slot {state.slot} · {state.total} open positions · bid principal {formatRecoverySol(state.totalBidPrincipalLamports)} SOL</p>}
      {!state.loading && !state.error && !state.items.length && <p className="rounded-xl border border-border p-5">No open native listings or bids were found for this wallet. Historical database records are not proof of funds remaining in escrow.</p>}
      <div className="space-y-4">{state.items.map(position => <RecoveryPosition key={position.position} position={position} attempts={state.attempts} busy={state.busy} cancel={state.cancel}/>)}</div>
      {state.has_more && <button onClick={state.more} disabled={Boolean(state.loading || state.busy)} className="mt-4 text-names-accent underline">Load more positions</button>}
      <RecoveryAttempts attempts={state.attempts} busy={state.busy} check={state.check} retry={state.retry}/>
    </>}
  </section></div></main>;
}