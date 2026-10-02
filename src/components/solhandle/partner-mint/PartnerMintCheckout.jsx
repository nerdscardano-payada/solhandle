import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import usePartnerMintPilot from '@/components/solhandle/partner-mint/usePartnerMintPilot';
import PartnerMintQuote from '@/components/solhandle/partner-mint/PartnerMintQuote';
import PartnerMintReceipt from '@/components/solhandle/partner-mint/PartnerMintReceipt';
import PartnerMintReport from '@/components/solhandle/partner-mint/PartnerMintReport';
import PartnerMintCostReview from '@/components/solhandle/partner-mint/PartnerMintCostReview';
export default function PartnerMintCheckout() {
  const { search } = useLocation();
  const urlParams = new URLSearchParams(search), partnerId = urlParams.get('partner') || '';
  const [handle, setHandle] = useState((urlParams.get('handle') || '').replace(/^@/, '').toLowerCase());
  const wallet = useWallet(), { setVisible } = useWalletModal(), pilot = usePartnerMintPilot(wallet, partnerId);
  if (!partnerId) return <div className="mt-6"><p className="text-muted-foreground">Open the pilot with the registered Devnet test partner. The partner is verified on-chain before minting.</p><Button asChild className="mt-4"><Link to={`/mint?partner=devnet-testpartner${handle ? `&handle=${encodeURIComponent(handle)}` : ''}`}>Open Devnet test partner</Link></Button></div>;
  if (!/^[a-z0-9-]{1,32}$/.test(partnerId)) return <p role="alert" className="mt-6 text-destructive">This partner ID is invalid. Open the pilot using a valid partner link; there is no fallback to ordinary minting.</p>;
  const valid = /^[a-z0-9]{1,20}$/.test(handle), currentQuote = pilot.quote?.quote.wallet === wallet.publicKey?.toBase58() ? pilot.quote : null;
  return <div className="mt-6">
    <p className="text-muted-foreground">Partner ID: {partnerId}. Approval and payment recipients are checked on-chain.</p>
    <div className="mt-5 flex flex-wrap items-center gap-3"><Button disabled={pilot.busy || wallet.connecting} onClick={() => wallet.connected ? wallet.disconnect() : setVisible(true)}>{wallet.connecting ? 'Connecting wallet…' : wallet.connected ? 'Disconnect wallet' : 'Connect Devnet wallet'}</Button></div>
    <div className="mt-3 text-sm" role="status" aria-live="polite">{wallet.connected && wallet.publicKey ? <><p className="text-names-success">Wallet connected: {wallet.wallet?.adapter.name}. Devnet checkout ready.</p><p className="mt-1 break-all text-xs text-muted-foreground">{wallet.publicKey.toBase58()}</p></> : <p className="text-muted-foreground">{wallet.connecting ? 'Approve the connection in your wallet extension.' : 'Wallet not connected. Select a wallet and approve its connection request to continue.'}</p>}</div>
    <form className="mt-5 flex gap-3" onSubmit={e => { e.preventDefault(); pilot.search(handle); }}><Input aria-label="Handle" placeholder="ansem" value={handle} disabled={pilot.busy || !!pilot.record} onChange={e => { setHandle(e.target.value.replace(/^@/, '').toLowerCase()); pilot.resetQuote(); }} /><Button type="submit" disabled={!valid || pilot.busy || !!pilot.record}>Search</Button></form>
    {pilot.availability && <p className="mt-3 text-sm">@{pilot.availability.handle}: {pilot.availability.status}. Availability is not a reservation.</p>}
    {pilot.availability?.available && !pilot.record && <><Button className="mt-4" disabled={pilot.busy || !wallet.connected || !wallet.publicKey || !wallet.signTransaction} onClick={() => pilot.review(handle)}>{pilot.busy ? 'Loading live SOL quote…' : 'Get live SOL quote'}</Button>{!wallet.connected && <p className="mt-2 text-sm text-names-warning">Connect your wallet above to unlock the live SOL quote. Requesting a quote does not require a signature or payment.</p>}</>}
    <PartnerMintQuote quote={currentQuote?.quote} />
    {currentQuote && <><p className="mt-3 text-xs text-muted-foreground">Quote expires: {new Date(currentQuote.expiresAt).toLocaleTimeString()}. Review separate costs before the wallet transaction.</p><PartnerMintCostReview prepared={pilot.prepared?.intentId === currentQuote.intentId ? pilot.prepared : null} /><Button className="mt-4" disabled={pilot.busy || !!pilot.record} onClick={pilot.prepared?.intentId === currentQuote.intentId ? pilot.mint : pilot.prepare}>{pilot.prepared?.intentId === currentQuote.intentId ? 'Sign and mint on Devnet' : 'Simulate and review total costs'}</Button></>}
    {pilot.busy && <p className="mt-4 text-sm text-muted-foreground" role="status">Processing Devnet request…</p>}
    {pilot.error && <p className="mt-4 text-sm text-destructive" role="alert">{pilot.error}</p>}
    <PartnerMintReceipt record={pilot.record} busy={pilot.busy} onCheck={pilot.check} onRetry={pilot.retry} onClear={pilot.clear} />
    <PartnerMintReport key={partnerId} partnerId={partnerId} refreshKey={`${pilot.record?.signature || ''}:${pilot.record?.status || ''}`} />
  </div>;
}