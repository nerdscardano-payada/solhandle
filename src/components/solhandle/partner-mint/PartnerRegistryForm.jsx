import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
export default function PartnerRegistryForm({ busy, onPrepare, onSync, authorityConnected }) {
  const [partnerId, setPartnerId] = useState('devnet-testpartner'), [displayName, setDisplayName] = useState(''), [wallet, setWallet] = useState(''), [partnerLink, setPartnerLink] = useState('');
  const valid = /^[a-z0-9-]{1,32}$/.test(partnerId);
  return <div className="mt-4 space-y-3">
    <Input aria-label="Canonical partner ID" placeholder="Canonical partner ID" value={partnerId} disabled={busy} onChange={e => setPartnerId(e.target.value)} />
    <Input aria-label="Partner display name" placeholder="Display name (optional)" value={displayName} disabled={busy} onChange={e => setDisplayName(e.target.value)} />
    <Input aria-label="New verified revenue wallet" placeholder="Revenue wallet for enrollment" value={wallet} disabled={busy} onChange={e => setWallet(e.target.value.trim())} />
    <Input aria-label="Existing Integration Rewards partner record" placeholder="Existing Integration Rewards partner ID (optional)" value={partnerLink} disabled={busy} onChange={e => setPartnerLink(e.target.value.trim())} />
    <div className="flex flex-wrap gap-3"><Button disabled={busy || !valid} variant="outline" onClick={() => onSync({ partnerId, displayName, ...(partnerLink ? { partnerLink } : {}) })}>Import / sync on-chain partner</Button><Button disabled={busy || !valid || !wallet || !authorityConnected} onClick={() => onPrepare({ operation: 'create', partnerId, displayName, revenueWallet: wallet, partnerLink })}>Prepare partner enrollment</Button></div>
    <p className="text-xs text-muted-foreground">Import changes reporting only. Enrollment needs the protocol authority plus the revenue-wallet owner's signature on the same expiring Devnet transaction. No private keys are stored.</p>
  </div>;
}