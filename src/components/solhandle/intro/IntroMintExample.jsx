import { AtSign, ArrowDown, BadgeCheck, Wallet } from 'lucide-react';

export default function IntroMintExample() {
  return <article aria-labelledby="intro-mint-title" className="rounded-2xl border border-names-accent/25 bg-card/80 p-5 text-left min-[768px]:p-6">
    <div className="flex items-center justify-between gap-3"><span className="text-xs font-semibold uppercase tracking-widest text-names-accent">SolHandle Mint</span><span className="rounded-full border border-border px-2 py-1 text-[10px] text-muted-foreground">Illustration</span></div>
    <h3 id="intro-mint-title" className="mt-4 font-heading text-xl font-semibold text-foreground">Claim a name. Own the NFT.</h3>
    <p className="mt-2 text-xs leading-5 text-muted-foreground">Choose your @handle and approve the mint in your wallet.</p>
    <div className="mt-5 rounded-xl border border-border bg-background/70 p-4">
      <div className="flex items-center gap-3"><AtSign className="h-6 w-6 shrink-0 text-names-accent"/><div><p className="text-[10px] uppercase tracking-widest text-muted-foreground">Your chosen name</p><p className="mt-1 font-display text-2xl font-semibold text-foreground">@ansem</p></div></div>
      <div className="my-4 flex items-center gap-2 text-xs text-muted-foreground"><ArrowDown className="h-4 w-4 text-names-accent"/>Approve mint in your wallet</div>
      <div className="rounded-lg border border-names-accent/20 bg-names-accent/5 p-3"><div className="flex items-center gap-2 text-sm font-semibold text-foreground"><BadgeCheck className="h-5 w-5 shrink-0 text-names-accent"/>Your SolHandle NFT</div><div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"><Wallet className="h-4 w-4 shrink-0"/><span>Owned by your wallet</span><span className="ml-auto font-mono">7Ytt…8uNw</span></div></div>
    </div>
    <p className="mt-4 text-xs leading-5 text-muted-foreground">Your @name points to your wallet. The NFT stays in the owner's wallet, not with SolHandle.</p>
  </article>;
}