import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
export default function PartnerRegistryRows({ profiles, busy, onPrepare, onSync, authorityConnected }) {
  const [wallets, setWallets] = useState({});
  return <div className="mt-5 space-y-4">{profiles.map(profile => <article key={profile.id} className="rounded-lg border border-border p-4">
    <div className="flex flex-wrap justify-between gap-2"><h3 className="font-heading font-semibold">{profile.display_name}</h3><span className="text-sm text-names-accent">{profile.status} · revision {profile.revision || 'pending'}</span></div>
    <p className="mt-2 break-all text-xs text-muted-foreground">{profile.partner_id} · {profile.revenue_wallet || 'Not approved on-chain'}</p>
    <p className="mt-2 text-xs text-muted-foreground">Chain snapshot: {profile.verified_at ? new Date(profile.verified_at).toLocaleString() : 'Not verified'}. Checkout always rechecks live approval.</p>
    <div className="mt-3 flex flex-wrap gap-2"><Button size="sm" variant="outline" disabled={busy} onClick={() => onSync({ partnerId: profile.partner_id })}>Sync chain state</Button>{['approved', 'suspended', 'disabled'].map(status => <Button key={status} size="sm" variant="outline" disabled={busy || !authorityConnected || !profile.revision || profile.status === status} onClick={() => onPrepare({ operation: 'status', partnerId: profile.partner_id, revision: profile.revision, status })}>{status === 'approved' ? 'Approve' : status === 'suspended' ? 'Suspend' : 'Disable'}</Button>)}<Button asChild size="sm" variant="outline"><Link to={`/mint?partner=${encodeURIComponent(profile.partner_id)}`}>Mint link</Link></Button></div>
    <div className="mt-3 flex flex-wrap gap-2"><Input className="min-w-0 flex-1" aria-label={`New revenue wallet for ${profile.partner_id}`} placeholder="New revenue wallet" disabled={busy} value={wallets[profile.id] || ''} onChange={e => setWallets({ ...wallets, [profile.id]: e.target.value.trim() })} /><Button variant="outline" disabled={busy || !authorityConnected || !profile.revision || !wallets[profile.id]} onClick={() => onPrepare({ operation: 'wallet', partnerId: profile.partner_id, revision: profile.revision, revenueWallet: wallets[profile.id] })}>Prepare wallet change</Button></div>
  </article>)}</div>;
}