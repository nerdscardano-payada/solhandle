export default function IrysFundingConfirmation({ proposal, busy, onConfirm, onCancel }) {
  return <div className="mt-4 rounded-xl border border-names-warning/40 bg-card p-4">
    <h3 className="font-semibold text-foreground">Confirm Irys deposit</h3>
    <p className="mt-2 text-sm text-muted-foreground">Send <strong className="text-foreground">{proposal.amount_sol} SOL</strong> from the server-managed uploader wallet to Irys on Solana Mainnet. Network fees are additional; this is not a payment from your connected wallet.</p>
    <p className="mt-2 break-all font-mono text-xs text-muted-foreground">{proposal.wallet}</p>
    <p className="mt-2 text-xs text-muted-foreground">Confirmation expires in five minutes. This deposit adds storage credit; it does not mint an NFT.</p>
    <div className="mt-4 flex flex-wrap gap-3"><button type="button" disabled={busy} onClick={onConfirm} className="ep-button ep-primary disabled:opacity-50">{busy ? 'Submitting deposit…' : `Confirm ${proposal.amount_sol} SOL deposit`}</button><button type="button" disabled={busy} onClick={onCancel} className="ep-button disabled:opacity-50">Cancel</button></div>
  </div>;
}