import { Link } from 'react-router-dom';
import formatHandleTokens from '@/components/solhandle/formatHandleTokens';
export default function HandlePaymentTestReceipt({ result, busy, onConfirm, onContinue }) {
  if (!result) return null;
  const payment = result.payment, tokens = raw => formatHandleTokens(raw, payment.decimals);
  return <div className="mt-5 rounded-xl border border-border bg-card p-4 text-sm text-card-foreground">
    <p className="font-semibold">{result.status === 'confirmed' ? payment ? `Verified token mint · @${payment.handle}` : 'Configuration confirmed' : result.status === 'failed' ? 'Transaction failed' : 'Submitted · confirmation pending'}</p>
    <a href={`https://explorer.solana.com/tx/${result.signature}`} target="_blank" rel="noreferrer" className="mt-2 block break-all text-primary underline">View mainnet transaction</a>
    {payment && <dl className="mt-3 grid gap-3 sm:grid-cols-3"><div><dt>Paid</dt><dd className="font-semibold">{tokens(payment.amount_raw)} $HANDLE</dd></div><div><dt>Verified burn</dt><dd className="font-semibold">{tokens(payment.burned_raw)} $HANDLE</dd></div><div><dt>Verified treasury receipt</dt><dd className="font-semibold">{tokens(payment.treasury_raw)} $HANDLE</dd></div></dl>}
    {payment && <p className="mt-3">NFT ownership verified for {payment.wallet}. <Link to={`/${payment.handle}`} className="text-primary underline">Open handle</Link></p>}
    {result.status === 'pending' && <><p className="mt-3">Do not send another mint while this transaction is unresolved.</p><button onClick={onConfirm} disabled={Boolean(busy)} className="mt-3 rounded-lg border border-border px-4 py-2 disabled:opacity-50">Check confirmation</button></>}
    {result.status !== 'pending' && <button onClick={onContinue} disabled={Boolean(busy)} className="mt-3 rounded-lg border border-border px-4 py-2 disabled:opacity-50">{result.kind === 'submit_configuration' ? 'Continue to mint test' : 'Review another test'}</button>}
  </div>;
}