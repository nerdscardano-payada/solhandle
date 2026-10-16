import { ShieldCheck, AlertTriangle } from 'lucide-react';
export default function ContactRecipientNotice({ contact, preview, onClear, disabled }) {
  const changed = preview && preview.address !== contact.recipient_wallet;
  return <div className="space-y-2 rounded-xl border border-names-accent/30 bg-names-accent/5 p-4">
    <div className="flex items-center justify-between gap-2"><p className="flex items-center gap-2 font-semibold text-names-accent"><ShieldCheck className="h-4 w-4"/>{contact.name}</p><button type="button" disabled={disabled} onClick={onClear} className="text-xs text-muted-foreground underline disabled:opacity-50">Clear contact</button></div>
    <p className="text-sm text-foreground">Saved as {contact.handle}</p><p className="break-all font-mono text-xs text-foreground">{contact.recipient_wallet}</p>
    {changed ? <p role="alert" className="flex items-start gap-2 text-sm text-names-warning"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0"/>This handle now points to a different wallet. Payment stays with the saved wallet above, never the new owner.</p> : <p className="text-xs text-muted-foreground">This saved wallet is fixed. We check the handle and wallet safety again before signing.</p>}
  </div>;
}