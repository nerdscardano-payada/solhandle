import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import useIrysFunding from '@/components/solhandle/admin/useIrysFunding';
import IrysFundingConfirmation from '@/components/solhandle/admin/IrysFundingConfirmation';

export default function AdminIrysFunding() {
  const funding = useIrysFunding();
  const [amount, setAmount] = useState('');
  const { data, busy, proposal, error, blocked } = funding;
  return <section className="ep-card mt-6 min-w-0" aria-busy={busy}>
    <div className="flex flex-wrap items-center justify-between gap-3"><div><span className="ep-eyebrow">NFT STORAGE · MAINNET</span><h2 className="text-xl font-semibold">Irys storage credit</h2></div><button type="button" onClick={funding.refresh} disabled={busy} className="ep-button disabled:opacity-50"><RefreshCw size={16} className={busy ? 'animate-spin' : ''}/>Refresh balances</button></div>
    <p className="mt-2 text-sm text-muted-foreground">Add storage credit from the server-managed uploader wallet. Only administrators can submit a deposit; the private key never leaves the server.</p>
    {!data && !error && <p role="status" className="mt-4 text-sm text-muted-foreground">Loading uploader balances…</p>}
    {data && <><p className="mt-4 text-xs text-muted-foreground">Uploader wallet</p><p className="mt-1 break-all font-mono text-xs text-foreground">{data.wallet}</p><dl className="mt-4 grid grid-cols-2 gap-4"><div><dt className="text-xs text-muted-foreground">Wallet SOL</dt><dd className="mt-1 font-semibold">{data.wallet_sol} SOL</dd></div><div><dt className="text-xs text-muted-foreground">Irys credit</dt><dd className="mt-1 font-semibold">{data.credit_sol} SOL</dd></div></dl></>}
    <form onSubmit={e => { e.preventDefault(); funding.prepare(amount); }} className="mt-5 space-y-3">
      <label htmlFor="irys-deposit-sol" className="block text-sm font-medium">Deposit amount (SOL)</label>
      <input id="irys-deposit-sol" type="text" inputMode="decimal" required value={amount} onChange={e => setAmount(e.target.value)} disabled={busy || blocked || Boolean(proposal)} placeholder="Enter an amount" aria-describedby="irys-deposit-help" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground disabled:opacity-50"/>
      <p id="irys-deposit-help" className="text-xs text-muted-foreground">0.000001–0.1 SOL per deposit. Keep at least 0.00005 SOL in the uploader wallet for fees. Sending SOL to this wallet alone does not add Irys credit.</p>
      {!proposal && <button type="submit" disabled={busy || blocked || !data || !amount.trim()} className="ep-button ep-primary disabled:opacity-50">{busy ? 'Please wait…' : 'Review Irys deposit'}</button>}
    </form>
    {proposal && <IrysFundingConfirmation proposal={proposal} busy={busy} onConfirm={funding.confirm} onCancel={funding.cancel}/>}
    {blocked && <p role="status" className="mt-4 text-sm text-names-warning">Funding is locked because a deposit is pending or its outcome is uncertain. Refresh balances and check the uploader wallet; do not repeat the deposit.</p>}
    {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
    {data?.message && <p role="status" className="mt-4 text-sm text-muted-foreground">{data.message}</p>}
    {data?.transaction_id && <a href={`https://explorer.solana.com/tx/${encodeURIComponent(data.transaction_id)}?cluster=mainnet-beta`} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-names-accent underline">View deposit transaction</a>}
  </section>;
}