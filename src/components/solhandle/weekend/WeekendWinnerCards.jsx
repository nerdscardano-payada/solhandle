import { Link } from 'react-router-dom';

export default function WeekendWinnerCards({ data }) {
  return <div className="mt-4 space-y-3 lg:hidden">{data.winners.map(r => {
    const paid = data.settlements.find(s => s.key === `reward:${r.wallet}`);
    return <article key={r.wallet} className="min-w-0 rounded-xl border border-border p-3">
      <div className="flex items-start justify-between gap-2"><Link to={`/${r.handle}`} className="min-w-0 break-all font-semibold text-names-accent">#{r.rank} · @{r.handle}</Link><span className="shrink-0 text-xs text-muted-foreground">{paid ? 'Paid' : data.scan?.final ? 'Awaiting payout' : 'Provisional'}</span></div>
      <p className="mt-2 text-sm">100,000 $HANDLE</p>
      <a className="mt-1 inline-flex min-h-11 items-center font-mono text-xs text-names-accent" href={`https://explorer.solana.com/address/${r.wallet}`} target="_blank" rel="noreferrer" aria-label={`View original mint wallet ${r.wallet}`}>{r.wallet.slice(0,8)}…{r.wallet.slice(-8)} ↗</a>
      <div className="flex flex-wrap gap-x-4"><a href={`https://explorer.solana.com/tx/${r.signature}`} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center text-sm text-names-accent">Mint transaction ↗</a>{paid && <a href={`https://explorer.solana.com/tx/${paid.signature}`} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center text-sm text-names-success">Reward payment ↗</a>}</div>
      <details className="text-xs text-muted-foreground"><summary className="flex min-h-11 cursor-pointer items-center">View mint details</summary><p className="break-all leading-6">Original mint wallet: {r.wallet}</p><p className="leading-6">Slot {r.slot} · tx #{r.transaction_index}<br/>{new Date(r.minted_at).toLocaleString('en-GB', { timeZone: 'Europe/Berlin' })} Berlin</p></details>
    </article>;
  })}</div>;
}