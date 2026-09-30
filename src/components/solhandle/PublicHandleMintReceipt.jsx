import { Link } from 'react-router-dom';
import formatHandleTokens from '@/components/solhandle/formatHandleTokens';
export default function PublicHandleMintReceipt({ mint }) {
  const receipt = mint.receipt;
  if (!receipt) return null;
  const payment = receipt.payment;
  const params = new URLSearchParams({ handle: receipt.handle, signature: receipt.signature, asset: receipt.asset || '', wallet: receipt.wallet, premium: String(Boolean(receipt.premium)), payment: 'HANDLE' });
  return <div className="dark rounded-xl border border-border bg-card p-4 text-sm text-card-foreground">
    <p className="font-semibold">{receipt.status === 'confirmed' ? `Verified $HANDLE mint · @${receipt.handle}` : receipt.status === 'pending' ? `Awaiting confirmation · @${receipt.handle}` : receipt.status === 'expired' ? 'Transaction expired' : 'Transaction failed'}</p>
    <a href={`https://explorer.solana.com/tx/${receipt.signature}`} target="_blank" rel="noreferrer" className="mt-2 block break-all underline">View mainnet transaction</a>
    {payment && <dl className="mt-3 space-y-2">{[['Paid', payment.amount_raw], ['Burned', payment.burned_raw], ['Treasury', payment.treasury_raw]].map(([label, raw]) => <div key={label}><dt>{label}</dt><dd className="font-semibold">{formatHandleTokens(raw, payment.decimals)} $HANDLE</dd></div>)}</dl>}
    {(mint.error || receipt.error) && <p role="alert" className="mt-3 text-destructive">{mint.error || receipt.error}</p>}
    {receipt.status === 'pending' && <><p className="mt-3">Do not send another mint while this transaction is unresolved. Your receipt is saved on this device.</p><button disabled={mint.checking} onClick={mint.confirm} className="mt-3 rounded-lg border border-border px-4 py-2 disabled:opacity-50">{mint.checking ? 'Checking…' : 'Check confirmation'}</button></>}
    {receipt.status === 'confirmed' && <Link to={`/mint-success?${params}`} className="mt-3 block underline">View your minted handle</Link>}
    {receipt.status !== 'pending' && <button type="button" onClick={mint.clear} className="mt-3 rounded-lg border border-border px-4 py-2">Dismiss</button>}
  </div>;
}