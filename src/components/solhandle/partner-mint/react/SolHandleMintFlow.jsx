import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useSolHandleMint from '@/components/solhandle/partner-mint/react/useSolHandleMint';
import SolHandleMintReview from '@/components/solhandle/partner-mint/react/SolHandleMintReview';
import PartnerMintReceipt from '@/components/solhandle/partner-mint/PartnerMintReceipt';
export default function SolHandleMintFlow(props) {
  const { partnerId, wallet, onConnect, onDisconnect, className, buttonText } = props;
  const [handle, setHandle] = useState(''), pilot = useSolHandleMint(props);
  const prepared = pilot.prepared?.quote.wallet === wallet.publicKey?.toBase58() ? pilot.prepared : null;
  const connectionAction = wallet.connected ? onDisconnect : onConnect;
  return <section className={`dark rounded-xl border border-border bg-card p-5 text-foreground ${className}`} aria-label="SolHandle Partner Mint" data-solhandle-mint="devnet">
    <h2 className="font-heading text-xl font-semibold">Claim je @handle</h2>
    <p className="mt-2 text-sm text-muted-foreground">Partner: {partnerId} · Solana Devnet · uitsluitend test-SOL</p>
    {connectionAction && <Button className="mt-5" disabled={pilot.busy || wallet.connecting} onClick={() => pilot.runConnection(connectionAction)}>{wallet.connecting ? 'Wallet verbinden…' : wallet.connected ? 'Wallet loskoppelen' : 'Devnet-wallet verbinden'}</Button>}
    {wallet.publicKey && <p className="mt-3 break-all text-xs text-muted-foreground">{wallet.publicKey.toBase58()}</p>}
    <form className="mt-5 flex flex-wrap gap-3" onSubmit={event => { event.preventDefault(); pilot.search(handle); }}>
      <Input className="min-w-0 flex-1" aria-label="Gewenste handle" placeholder="@ansem" value={handle} disabled={pilot.busy || !!pilot.record} onChange={event => { setHandle(event.target.value.replace(/^@/, '').toLowerCase()); pilot.resetReview(); }}/>
      <Button type="submit" disabled={pilot.busy || !!pilot.record || !/^[a-z0-9]{1,20}$/.test(handle)}>Beschikbaarheid controleren</Button>
    </form>
    {pilot.availability && <p className="mt-3 text-sm" role="status">@{pilot.availability.handle}: {pilot.availability.status}. Zoeken reserveert de naam niet.</p>}
    {pilot.availability?.available && !pilot.record && !prepared && <Button className="mt-4" disabled={pilot.busy || !wallet.connected || !wallet.signTransaction} onClick={() => pilot.review(handle)}>Actuele offerte en totale kosten ophalen</Button>}
    {!wallet.connected && <p className="mt-3 text-sm text-muted-foreground">Zoeken kan zonder wallet. Verbind een wallet met test-SOL en zet deze op Solana Devnet.</p>}
    {prepared && !pilot.record && <SolHandleMintReview prepared={prepared} busy={pilot.busy} connected={wallet.connected} buttonText={buttonText} onMint={pilot.mint} onRefresh={() => pilot.review(handle)}/>}
    {pilot.busy && <p className="mt-4 text-sm text-muted-foreground" role="status" aria-live="polite">Devnet-aanvraag verwerken…</p>}
    {pilot.error && <p className="mt-4 break-words text-sm text-destructive" role="alert">{pilot.error}</p>}
    <PartnerMintReceipt record={pilot.record} busy={pilot.busy} onCheck={pilot.check} onRetry={pilot.retry} onClear={pilot.clear}/>
    <p className="mt-4 text-xs text-muted-foreground">Officiële NFT rechtstreeks naar je wallet. De SOL-mintvergoeding wordt atomair 50/50 verdeeld; netwerk- en accountkosten vallen daarbuiten. Ondertekende transacties blijven lokaal bewaard voor herstel, nooit privésleutels. Controleer bij een timeout de status zonder opnieuw te tekenen.</p>
  </section>;
}