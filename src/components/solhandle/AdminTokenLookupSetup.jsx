import { useState } from 'react';
import { Link } from 'react-router-dom';
import useTokenLookupSetup from '@/components/solhandle/useTokenLookupSetup';
export default function AdminTokenLookupSetup() {
  const state = useTokenLookupSetup(), [accepted, setAccepted] = useState(false);
  const pending = state.receipt?.status === 'pending';
  return <section className="mt-8 rounded-2xl border border-border bg-card p-5">
    <h2 className="text-xl font-heading font-semibold">Compact $HANDLE transactions</h2>
    <p className="mt-2 text-sm text-muted-foreground">Create one frozen Address Lookup Table to reduce mint transaction size. Payment, the 50% burn and NFT mint remain atomic. This does not guarantee removal of Phantom warnings.</p>
    {!state.status && !state.error && <p className="mt-3 text-sm text-muted-foreground" role="status">Loading setup status…</p>}
    {state.status && <>
      <p className="mt-3 text-sm">{state.status.active ? 'Active — public and administrator token mints now use compact transactions.' : 'Not active — existing minting remains unchanged until setup is finalized.'}</p>
      {state.status.address && <a href={`https://solscan.io/account/${state.status.address}`} target="_blank" rel="noreferrer" className="mt-2 block break-all font-mono text-sm text-primary underline">View frozen lookup table</a>}
      {!state.status.active && <>
        <p className="mt-3 break-all text-xs text-muted-foreground">Required authority wallet: {state.status.authority}</p>
        <label className="mt-3 flex items-start gap-2 text-sm"><input type="checkbox" checked={accepted} disabled={state.busy || pending} onChange={event => setAccepted(event.target.checked)} /><span>I approve a real mainnet setup: approximately {(state.status.rentLamports / 1e9).toFixed(6)} SOL locked permanently as rent, plus network fees; the frozen table cannot be edited or closed.</span></label>
        <button type="button" onClick={state.setup} disabled={!accepted || state.busy || pending || state.wallet !== state.status.authority} className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">{state.busy ? 'Working…' : 'Approve compact transaction setup'}</button>
      </>}
    </>}
    {state.receipt && <div className="mt-4 text-sm"><p>Setup: {state.receipt.status === 'pending' ? 'Waiting for finalization and activation…' : state.receipt.status}</p><a href={`https://solscan.io/tx/${state.receipt.signature}`} target="_blank" rel="noreferrer" className="underline">View setup transaction</a>{pending && <div className="mt-2 flex flex-wrap gap-3"><button type="button" disabled={state.busy} onClick={state.check} className="underline disabled:opacity-50">Check and activate</button><button type="button" disabled={state.busy} onClick={state.resend} className="underline disabled:opacity-50">Resend same signed setup</button></div>}</div>}
    {state.error && <p role="alert" className="mt-3 text-sm text-destructive">{state.error}</p>}
    <div className="mt-3 flex gap-4 text-sm"><button type="button" onClick={state.refresh} disabled={state.busy} className="underline disabled:opacity-50">Refresh status</button>{state.status?.active && <Link to="/" className="underline">Try a compact $HANDLE mint</Link>}</div>
  </section>;
}