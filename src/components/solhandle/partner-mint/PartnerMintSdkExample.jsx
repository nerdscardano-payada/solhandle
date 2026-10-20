import { useState } from 'react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import usePartnerMintSdkExample from '@/components/solhandle/partner-mint/usePartnerMintSdkExample';
import PartnerMintQuote from '@/components/solhandle/partner-mint/PartnerMintQuote';
import PartnerMintCostReview from '@/components/solhandle/partner-mint/PartnerMintCostReview';
import PartnerMintReceipt from '@/components/solhandle/partner-mint/PartnerMintReceipt';
export default function PartnerMintSdkExample({ partnerId }) {
  const [handle, setHandle] = useState('');
  const pilot = usePartnerMintSdkExample(partnerId), { wallet } = pilot, { setVisible } = useWalletModal();
  const prepared = pilot.prepared?.quote.wallet === wallet.publicKey?.toBase58() ? pilot.prepared : null;
  return <section className="mt-7 rounded-xl border border-border bg-card p-5" aria-label="Live SDK Devnet-voorbeeld">
    <h2 className="font-heading text-xl font-semibold">Live SDK-voorbeeld</h2>
    <p className="mt-2 text-sm text-muted-foreground">Partner: {partnerId}. Deze flow gebruikt de nieuwe mint-SDK en de bestaande Devnet-diensten, geen gesimuleerde resultaten.</p>
    <Button className="mt-5" disabled={pilot.busy || wallet.connecting} onClick={() => wallet.connected ? wallet.disconnect() : setVisible(true)}>{wallet.connecting ? 'Wallet verbinden…' : wallet.connected ? 'Wallet loskoppelen' : 'Devnet-wallet verbinden'}</Button>
    {wallet.publicKey && <p className="mt-3 break-all text-xs text-muted-foreground">{wallet.wallet?.adapter.name}: {wallet.publicKey.toBase58()}</p>}
    <form className="mt-5 flex flex-wrap gap-3" onSubmit={event => { event.preventDefault(); pilot.search(handle); }}>
      <Input className="min-w-0 flex-1" aria-label="Gewenste handle" placeholder="@ansem" value={handle} disabled={pilot.busy || !!pilot.record} onChange={event => { setHandle(event.target.value.replace(/^@/, '').toLowerCase()); pilot.resetReview(); }}/>
      <Button type="submit" disabled={pilot.busy || !!pilot.record || !/^[a-z0-9]{1,20}$/.test(handle)}>Beschikbaarheid controleren</Button>
    </form>
    {pilot.availability && <p className="mt-3 text-sm" role="status">@{pilot.availability.handle}: {pilot.availability.status}. Zoeken reserveert de naam niet.</p>}
    {pilot.availability?.available && !pilot.record && <Button className="mt-4" disabled={pilot.busy || !wallet.connected || !wallet.signTransaction} onClick={() => pilot.review(handle)}>Actuele offerte en totale kosten ophalen</Button>}
    {!wallet.connected && <p className="mt-3 text-sm text-muted-foreground">Zoeken kan zonder wallet. Verbind een wallet met test-SOL voor een offerte en zet deze op Solana Devnet.</p>}
    <PartnerMintQuote quote={prepared?.quote}/>
    <PartnerMintCostReview prepared={prepared}/>
    {prepared && !pilot.record && <><p className="mt-3 text-xs text-muted-foreground">Offerte geldig tot {new Date(prepared.quote.expiresAtUnix * 1000).toLocaleTimeString()}. Controleer ontvangers en alle kosten voordat je tekent.</p><Button className="mt-4" disabled={pilot.busy} onClick={pilot.mint}>Kosten akkoord: ondertekenen en minten op Devnet</Button></>}
    {pilot.busy && <p className="mt-4 text-sm text-muted-foreground" role="status" aria-live="polite">Devnet-aanvraag verwerken…</p>}
    {pilot.error && <p className="mt-4 break-words text-sm text-destructive" role="alert">{pilot.error}</p>}
    <PartnerMintReceipt record={pilot.record} busy={pilot.busy} onCheck={pilot.check} onRetry={pilot.retry} onClear={pilot.clear}/>
    <p className="mt-4 text-xs text-muted-foreground">Ondertekende Devnet-transacties worden vóór verzending lokaal in deze browser bewaard voor herstel; nooit privésleutels. Bij een timeout controleer je dezelfde intent, zonder opnieuw te tekenen.</p>
  </section>;
}