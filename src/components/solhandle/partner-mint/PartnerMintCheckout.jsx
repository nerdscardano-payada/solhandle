import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import usePartnerMintPilot from '@/components/solhandle/partner-mint/usePartnerMintPilot';
import PartnerMintQuote from '@/components/solhandle/partner-mint/PartnerMintQuote';
import PartnerMintReceipt from '@/components/solhandle/partner-mint/PartnerMintReceipt';
export default function PartnerMintCheckout() {
  const urlParams = new URLSearchParams(window.location.search), partnerId = urlParams.get('partner') || '';
  const [handle, setHandle] = useState((urlParams.get('handle') || '').replace(/^@/, '').toLowerCase());
  const wallet = useWallet(), { setVisible } = useWalletModal(), pilot = usePartnerMintPilot(wallet, partnerId);
  if (!partnerId) return <div className="mt-6"><p className="text-muted-foreground">Open de pilot met de geregistreerde Devnet-testpartner. De partner wordt vóór het minten on-chain gecontroleerd.</p><Button asChild className="mt-4"><Link to={`/mint?partner=devnet-testpartner${handle ? `&handle=${encodeURIComponent(handle)}` : ''}`}>Open Devnet-testpartner</Link></Button></div>;
  if (!/^[a-z0-9-]{1,32}$/.test(partnerId)) return <p role="alert" className="mt-6 text-destructive">Deze partnercode is ongeldig. Open de pilot via een geldige partnerlink; er wordt niet overgeschakeld naar gewone minting.</p>;
  const valid = /^[a-z0-9]{1,20}$/.test(handle), currentQuote = pilot.quote?.quote.wallet === wallet.publicKey?.toBase58() ? pilot.quote : null;
  return <div className="mt-6">
    <p className="text-muted-foreground">Partner ID: {partnerId}. Approval and payment recipients are checked on-chain.</p>
    <div className="mt-5 flex flex-wrap items-center gap-3"><Button disabled={pilot.busy || wallet.connecting} onClick={() => wallet.publicKey ? wallet.disconnect() : setVisible(true)}>{wallet.publicKey ? 'Disconnect wallet' : 'Connect Devnet wallet'}</Button>{wallet.publicKey && <p className="break-all text-xs text-muted-foreground">{wallet.publicKey.toBase58()}</p>}</div>
    <form className="mt-5 flex gap-3" onSubmit={e => { e.preventDefault(); pilot.search(handle); }}><Input aria-label="Handle" placeholder="ansem" value={handle} disabled={pilot.busy || !!pilot.record} onChange={e => { setHandle(e.target.value.replace(/^@/, '').toLowerCase()); pilot.resetQuote(); }} /><Button type="submit" disabled={!valid || pilot.busy || !!pilot.record}>Search</Button></form>
    {pilot.availability && <p className="mt-3 text-sm">@{pilot.availability.handle}: {pilot.availability.status}. Availability is not a reservation.</p>}
    {pilot.availability?.available && !pilot.record && <Button className="mt-4" disabled={pilot.busy || !wallet.publicKey} onClick={() => pilot.review(handle)}>Get live SOL quote</Button>}
    <PartnerMintQuote quote={currentQuote?.quote} />
    {currentQuote && <><p className="mt-3 text-xs text-muted-foreground">Quote expires: {new Date(currentQuote.expiresAt).toLocaleTimeString()}. Review the transaction in your wallet.</p><Button className="mt-4" disabled={pilot.busy || !!pilot.record} onClick={pilot.mint}>Sign and mint on Devnet</Button></>}
    {pilot.busy && <p className="mt-4 text-sm text-muted-foreground" role="status">Processing Devnet request…</p>}
    {pilot.error && <p className="mt-4 text-sm text-destructive" role="alert">{pilot.error}</p>}
    <PartnerMintReceipt record={pilot.record} busy={pilot.busy} onCheck={pilot.check} onRetry={pilot.retry} onClear={pilot.clear} />
  </div>;
}