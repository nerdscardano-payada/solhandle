import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { pilotCall, pilotMessage } from '@/components/solhandle/partner-mint/partnerPilotClient';
export default function PartnerMintDirectRecovery({ partnerId }) {
  const [signature, setSignature] = useState(''), client = useQueryClient();
  const recovery = useMutation({ mutationFn: () => pilotCall('recover', { partnerId, signature: signature.trim() }), onSuccess: () => client.invalidateQueries({ queryKey: ['partner-mint-report', partnerId] }) });
  return <details className="mt-5 rounded-lg border border-border p-4"><summary className="cursor-pointer text-sm font-semibold">Recover a directly broadcast mint</summary>
    <p className="mt-3 text-sm text-muted-foreground">Paste a successful finalized Devnet Partner Mint signature. The program, signed instruction, immutable receipt, original owner and exact split are rechecked; no payment is sent.</p>
    <form className="mt-3 space-y-3" onSubmit={e => { e.preventDefault(); recovery.mutate(); }}><Input aria-label="Devnet transaction signature" placeholder="Devnet transaction signature" value={signature} disabled={recovery.isPending} onChange={e => setSignature(e.target.value)} /><Button disabled={recovery.isPending || !signature.trim()} type="submit">{recovery.isPending ? 'Verifying on-chain…' : 'Verify and recover receipt'}</Button></form>
    {recovery.error && <p className="mt-3 text-sm text-destructive" role="alert">{pilotMessage(recovery.error)}</p>}
    {recovery.data && <p className="mt-3 text-sm text-names-success" role="status">{recovery.data.status}: verified @{recovery.data.receipt?.handle}. Receipt saved without duplicate revenue.</p>}
  </details>;
}