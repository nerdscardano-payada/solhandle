import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import PartnerMintQuote from '@/components/solhandle/partner-mint/PartnerMintQuote';
import PartnerMintCostReview from '@/components/solhandle/partner-mint/PartnerMintCostReview';
export default function SolHandleMintReview({ prepared, busy, connected, buttonText, onMint, onRefresh }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, []);
  const expired = now >= prepared.quote.expiresAtUnix * 1000;
  return <div>
    <PartnerMintQuote quote={prepared.quote}/><PartnerMintCostReview prepared={prepared}/>
    <p className="mt-3 text-xs text-muted-foreground">Offerte geldig tot {new Date(prepared.quote.expiresAtUnix * 1000).toLocaleTimeString()}. Controleer ontvangers en alle kosten voordat je tekent.</p>
    {expired ? <><p className="mt-3 text-sm text-names-warning" role="status">Offerte verlopen. Haal nieuwe kosten op voordat je ondertekent.</p><Button className="mt-4" disabled={busy || !connected} onClick={onRefresh}>Nieuwe offerte ophalen</Button></> : <Button className="mt-4" disabled={busy || !connected} onClick={onMint}>{buttonText}</Button>}
  </div>;
}