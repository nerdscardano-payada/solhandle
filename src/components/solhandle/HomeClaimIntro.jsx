import { ArrowRight, BadgeCheck, WalletCards } from 'lucide-react';

export default function HomeClaimIntro() {
  return <section>
    <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-names-accent/20 bg-names-accent/5 px-3 py-1 text-xs text-names-accent"><BadgeCheck className="h-3.5 w-3.5"/>NFT-native identity on Solana</p>
    <h1 className="text-[clamp(3.5rem,4.2vw,4.25rem)] font-semibold leading-[1.05] tracking-tight">Claim your @<br/><span className="bg-gradient-to-r from-names-success via-names-accent to-names-secondary bg-clip-text text-transparent">on Solana.</span></h1>
    <p className="mt-6 max-w-md text-lg leading-relaxed text-names-accent/80">Your wallet has an address. Give it a name people can remember.</p>
    <p className="mt-3 max-w-md text-base leading-relaxed text-names-secondary/80">A SolHandle is a unique @handle that resolves to your Solana wallet. Search for a name, claim it, and own it as an NFT directly in your wallet.</p>
    <p className="mt-5 flex items-center gap-3 text-xl" aria-label="From a long wallet address to @ansem"><span className="font-mono text-names-secondary/70">7xKp…9mWq</span><ArrowRight className="h-5 w-5 shrink-0 text-names-accent" aria-hidden="true"/><span className="font-semibold text-names-accent">@ansem</span></p>
    <div className="mt-6 space-y-3 text-sm">
      <div className="flex items-center gap-3"><WalletCards className="h-5 w-5 shrink-0 text-names-success"/><span>One-time payment. No renewal fees.</span></div>
      <div className="flex items-center gap-3"><ArrowRight className="h-5 w-5 shrink-0 text-names-secondary"/><span>Send SOL to an @handle with SolHandle Pay.</span></div>
    </div>
  </section>;
}