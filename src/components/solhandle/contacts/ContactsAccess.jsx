import { useEffect, useState } from 'react';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
export default function ContactsAccess({ access }) {
  const [rememberDevice, setRememberDevice] = useState(false);
  useEffect(() => { setRememberDevice(false); }, [access.wallet]);
  return <div className="rounded-2xl border border-names-accent/20 bg-card p-5 text-foreground">
    <LockKeyhole className="h-7 w-7 text-names-accent"/>
    <h2 className="mt-3 text-lg font-semibold">Your wallet. Your contacts.</h2>
    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Private contacts sync between mobile and web for the same wallet. Sign a free, one-time wallet message to start a 7-day session on this device. No account or transaction required.</p>
    {access.wallet && <label className="mt-4 flex min-h-12 cursor-pointer items-start gap-3 text-sm"><input type="checkbox" checked={rememberDevice} disabled={access.busy} onChange={event => setRememberDevice(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-names-accent"/><span>Remember this device for 30 days<span className="mt-1 block text-xs text-muted-foreground">Unchecked: stay signed in for 7 days. Only select this on a trusted device.</span></span></label>}
    {access.wallet ? <button type="button" disabled={access.busy} onClick={() => access.unlock(rememberDevice)} className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-names-accent px-4 py-3 font-semibold text-hero-canvas disabled:opacity-50"><ShieldCheck className="h-4 w-4"/>{access.busy ? 'Waiting for wallet…' : 'Unlock My Contacts'}</button> : <p className="mt-4 text-sm text-names-warning">Connect your wallet above to get started.</p>}
    {access.error && <p role="alert" className="mt-3 text-sm text-names-warning">{access.error}</p>}
    <p className="mt-3 text-xs text-muted-foreground">Contacts are stored off-chain, not just on this device. Access is wallet-verified; this is not end-to-end encryption.</p>
  </div>;
}