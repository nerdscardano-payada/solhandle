import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import usePartnerRegistry from '@/components/solhandle/partner-mint/usePartnerRegistry';
import PartnerRegistryForm from '@/components/solhandle/partner-mint/PartnerRegistryForm';
import PartnerRegistryRows from '@/components/solhandle/partner-mint/PartnerRegistryRows';
import PartnerRegistryOperation from '@/components/solhandle/partner-mint/PartnerRegistryOperation';
import { pilotMessage } from '@/components/solhandle/partner-mint/partnerPilotClient';
export default function PartnerRegistryAdmin() {
  const wallet = useWallet(), { setVisible } = useWalletModal(), registry = usePartnerRegistry(wallet);
  const busy = registry.busy || registry.query.isFetching, authorityConnected = wallet.publicKey?.toBase58() === registry.settings?.authority;
  return <details className="mt-8 rounded-xl border border-names-secondary/30 bg-card p-5"><summary className="cursor-pointer font-heading text-xl">Devnet partner administration</summary>
    <p className="mt-4 text-sm text-muted-foreground">Only the on-chain protocol authority can enroll, approve, suspend, disable or change a partner. An administrator account alone grants no signing authority. These controls never target Mainnet.</p>
    <div className="mt-4 flex flex-wrap gap-3"><Button variant="outline" disabled={busy || wallet.connecting} onClick={() => wallet.connected ? wallet.disconnect() : setVisible(true)}>{wallet.connected ? 'Disconnect / switch signing wallet' : 'Connect signing wallet'}</Button><Button variant="outline" disabled={busy} onClick={() => registry.query.refetch()}>Refresh registry</Button></div>
    {registry.settings && <><p className="mt-3 break-all text-xs text-muted-foreground">Devnet authority: {registry.settings.authority}</p><p className="mt-2 text-sm">Partner Mint switch: {registry.settings.enabled ? 'Enabled' : 'Disabled'} · settings revision {registry.settings.settingsRevision}</p><Button className="mt-3" variant="outline" disabled={busy || !authorityConnected || !!registry.record} onClick={() => registry.prepare({ operation: 'settings', enabled: !registry.settings.enabled })}>Prepare {registry.settings.enabled ? 'emergency disable' : 'Devnet enable'}</Button></>}
    {!authorityConnected && <p className="mt-3 text-xs text-names-warning">Connect the authority wallet to prepare changes. For a prepared joint change, switch to its required revenue wallet to add that signature.</p>}
    {(registry.error || registry.query.error) && <p role="alert" className="mt-3 text-sm text-destructive">{registry.error || pilotMessage(registry.query.error)}</p>}
    {busy && <p role="status" className="mt-3 text-sm text-muted-foreground">Processing Devnet registry request…</p>}
    <PartnerRegistryForm busy={busy || !!registry.record} authorityConnected={authorityConnected} onPrepare={registry.prepare} onSync={registry.sync} />
    <PartnerRegistryOperation record={registry.record} busy={busy} onSign={registry.sign} onSubmit={registry.submit} onCheck={registry.check} onClear={registry.clear} />
    {!registry.query.isPending && !registry.profiles.length && <p className="mt-4 text-sm text-muted-foreground">No partner profiles imported yet. Import a registered on-chain partner or enroll a new one using joint signatures.</p>}
    <PartnerRegistryRows profiles={registry.profiles} busy={busy || !!registry.record} authorityConnected={authorityConnected} onPrepare={registry.prepare} onSync={registry.sync} />
    {registry.query.hasNextPage && <Button className="mt-4" variant="outline" disabled={busy} onClick={() => registry.query.fetchNextPage()}>Load more partners</Button>}
    {!!registry.history.length && <details className="mt-5"><summary className="cursor-pointer text-sm">Recent approval audit history</summary><div className="mt-3 space-y-2">{registry.history.map(item => <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 text-xs"><span>{item.operation} · {item.partner_id || 'Settings'} · {item.status}</span><Button size="sm" variant="outline" disabled={busy} onClick={() => registry.check(item)}>Check saved change</Button></div>)}</div></details>}
  </details>;
}