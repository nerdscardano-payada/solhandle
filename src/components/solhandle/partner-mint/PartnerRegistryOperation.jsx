import { Button } from '@/components/ui/button';
export default function PartnerRegistryOperation({ record, busy, onSign, onSubmit, onCheck, onClear }) {
  if (!record) return null;
  const terminal = ['FINALIZED', 'FAILED'].includes(record.status) || (record.status === 'EXPIRED' && !record.signature);
  return <div className="mt-5 rounded-lg border border-names-warning/40 p-4">
    <h3 className="font-semibold">Review Devnet registry change</h3><p className="mt-2 text-sm">{record.operation} · {record.partnerId || 'Partner Mint settings'} · {record.status}</p>
    {record.desired && <dl className="mt-3 space-y-2 break-all text-xs text-muted-foreground">{Object.entries(record.desired).map(([key, value]) => <div key={key}><dt className="inline font-semibold">{key}: </dt><dd className="inline">{String(value)}</dd></div>)}</dl>}
    <p className="mt-3 text-xs text-muted-foreground">Enrollment and wallet changes require both wallets to sign these exact bytes. Connect each required wallet in turn; submit only when every signature is present. Blockhash expiry prevents indefinite approvals.</p>
    {record.requiredSigners?.map(address => <p key={address} className="mt-2 break-all text-xs">{record.signedWallets?.includes(address) ? 'Signed' : 'Signature required'}: {address}</p>)}
    {record.signature && <a className="mt-3 block text-sm text-names-accent underline" target="_blank" rel="noreferrer" href={`https://explorer.solana.com/tx/${record.signature}?cluster=devnet`}>View registry transaction</a>}
    <div className="mt-4 flex flex-wrap gap-2">{!terminal && !record.signature && <><Button disabled={busy} onClick={onSign}>Sign with connected wallet</Button><Button disabled={busy || !record.complete} onClick={onSubmit}>Submit signed change</Button></>}{!terminal && record.signature && record.complete && <Button variant="outline" disabled={busy} onClick={onSubmit}>Relay same signed change</Button>}<Button variant="outline" disabled={busy} onClick={() => onCheck()}>Check saved change</Button>{terminal && <Button variant="outline" disabled={busy} onClick={onClear}>Clear completed change</Button>}</div>
  </div>;
}