import { Wallet, Coins, ShieldCheck } from 'lucide-react';

export default function HomeMobileTrust() {
  return <div className="mt-5 grid gap-3 text-xs text-foreground/85 lg:hidden" aria-label="Mint with confidence">
    <span className="flex items-center gap-2"><Wallet className="h-4 w-4 shrink-0 text-names-accent" aria-hidden="true"/>NFT minted directly to your wallet</span>
    <span className="flex items-center gap-2"><Coins className="h-4 w-4 shrink-0 text-names-accent" aria-hidden="true"/>One-time payment · No renewals</span>
    <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-names-accent" aria-hidden="true"/>You review costs and approve the transaction</span>
  </div>;
}