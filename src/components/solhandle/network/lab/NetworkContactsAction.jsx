import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useContactsAccess from '@/components/solhandle/contacts/useContactsAccess';
import { contactRequest, contactMessage } from '@/components/solhandle/contacts/contactClient';
import labClient from '@/components/solhandle/network/lab/labClient';
export default function NetworkContactsAction({ actorId, profile }) {
  const access = useContactsAccess();
  const client = useQueryClient();
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  const recipient = async () => (await labClient({ action: 'identityRecipient', actorId, target: profile.id, bindingId: profile.bindingId })).recipient;
  const query = useQuery({ queryKey: ['network-contact', access.wallet, actorId, profile.id, profile.bindingId, access.session?.expires_at], enabled: Boolean(access.unlocked && profile.paymentsEnabled), queryFn: async () => { const current = await recipient(); return await contactRequest('findRecipient', access.wallet, { recipientWallet: current.address }); }, retry: false });
  const save = async () => {
    setBusy(true); setError('');
    try { const current = await recipient(); await contactRequest('save', access.wallet, { name: profile.name, handle: current.handle, expectedWallet: current.address }); await Promise.all([client.invalidateQueries({ queryKey: ['network-contact'] }), client.invalidateQueries({ queryKey: ['wallet-contacts', access.wallet] })]); }
    catch (err) { setError(contactMessage(err)); } finally { setBusy(false); }
  };
  if (!profile.paymentsEnabled) return null;
  return <div className="space-y-2"><button type="button" disabled={busy || access.busy || query.isFetching || Boolean(query.data?.contact) || !access.wallet} onClick={() => access.unlocked ? save() : access.unlock(false)} className="rounded-full border border-identity-border px-4 py-2 text-sm text-names-secondary disabled:opacity-50">{query.data?.contact ? 'In Contacts' : busy ? 'Saving…' : !access.wallet ? 'Connect wallet for Contacts' : !access.unlocked ? 'Unlock existing Contacts' : 'Save to Contacts'}</button><p className="max-w-sm text-xs text-identity-muted">Uses your existing private Contacts. Saved wallets stay fixed if the handle later transfers.</p>{(error || access.error || query.isError) && <p role="alert" className="text-xs text-names-warning">{error || access.error || contactMessage(query.error)}</p>}</div>;
}