import { useState } from 'react';
import { Send, ContactRound } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNetworkSession } from '@/components/solhandle/network/NetworkSessionProvider';
import useIdentityAttempt from '@/components/solhandle/network/lab/useIdentityAttempt';
import NetworkPaymentDrawer from '@/components/solhandle/network/NetworkPaymentDrawer';
import labClient, { labError } from '@/components/solhandle/network/lab/labClient';
import NetworkContactsAction from '@/components/solhandle/network/lab/NetworkContactsAction';
export default function NetworkRecipientActions({ actorId, profile, compact = false }) {
  const session = useNetworkSession();
  const wallet = useWallet();
  const guard = useIdentityAttempt({ actorId, address: wallet.publicKey?.toBase58() || '', adapter: wallet.wallet?.adapter, connected: wallet.connected });
  const [selection, setSelection] = useState(null);
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  const recipient = selection?.contextKey === session?.contextKey && selection?.profileId === profile.id && selection?.bindingId === profile.bindingId ? selection.recipient : null;
  const pay = async () => {
    if (!session?.ready || session.actorId !== actorId) return;
    const attempt = guard.begin();
    if (!attempt) return;
    setBusy(true); setError('');
    try {
      const { recipient: current } = await labClient({ action: 'identityRecipient', actorId, target: profile.id, bindingId: profile.bindingId });
      attempt.assertCurrent();
      setSelection({ recipient: current, contextKey: session.contextKey, profileId: profile.id, bindingId: profile.bindingId });
    } catch (err) { if (attempt.current()) setError(labError(err)); }
    finally { if (attempt.current()) setBusy(false); attempt.finish(); }
  };
  return <div className={compact ? 'sd-profile-recipient-actions' : 'space-y-3'}><div className="flex flex-wrap gap-2"><button type="button" disabled={busy || !session?.ready || !profile.paymentsEnabled} title={!profile.paymentsEnabled ? 'Requires a currently verified owned handle.' : 'Open the existing SolHandle Pay review; no automatic payment.'} onClick={pay} className="sd-button sd-secondary"><Send size={16}/>{busy ? 'Checking current owner…' : compact ? 'Pay' : `Pay ${profile.handle || '@handle'}`}</button>{compact ? profile.paymentsEnabled && <details className="sd-profile-contact-options"><summary className="sd-button sd-secondary" aria-label="Contact options"><ContactRound size={16}/></summary><div><NetworkContactsAction actorId={actorId} profile={profile}/></div></details> : <NetworkContactsAction actorId={actorId} profile={profile}/>}</div><NetworkPaymentDrawer key={`${session?.contextKey}:${profile.id}:${profile.bindingId}`} recipient={recipient} open={Boolean(recipient)} onOpenChange={value => { if (!value) setSelection(null); }}/>{error && <p role="alert" className="text-sm text-names-warning">{error}</p>}</div>;
}