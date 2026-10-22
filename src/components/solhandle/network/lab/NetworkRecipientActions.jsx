import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import labClient, { labError } from '@/components/solhandle/network/lab/labClient';
import NetworkContactsAction from '@/components/solhandle/network/lab/NetworkContactsAction';
export default function NetworkRecipientActions({ actorId, profile }) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  const pay = async () => {
    setBusy(true); setError('');
    try { const { recipient } = await labClient({ action: 'identityRecipient', actorId, target: profile.id, bindingId: profile.bindingId }); navigate('/pay', { state: { networkRecipient: recipient } }); }
    catch (err) { setError(labError(err)); } finally { setBusy(false); }
  };
  return <div className="space-y-3"><div className="flex flex-wrap gap-3"><button type="button" disabled={busy || !profile.paymentsEnabled} title={!profile.paymentsEnabled ? 'Requires a currently verified owned handle.' : 'Open the existing SolHandle Pay review; no automatic payment.'} onClick={pay} className="rounded-full border border-names-accent/40 px-4 py-2 text-sm text-names-accent disabled:opacity-40">{busy ? 'Checking current owner…' : `Pay ${profile.handle || '@handle'}`}</button><NetworkContactsAction actorId={actorId} profile={profile}/></div>{error && <p role="alert" className="text-sm text-names-warning">{error}</p>}</div>;
}