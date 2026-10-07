import { BadgeCheck, WalletCards, ArrowRight } from 'lucide-react';

export default function HomeIdentityPreview() {
  return <aside aria-label="Illustrative SolHandle identity" className="relative rounded-3xl border border-names-secondary/30 bg-card/70 p-8 shadow-2xl shadow-names-secondary/10">
    <div className="flex items-center justify-between">
      <span className="grid h-16 w-16 place-items-center rounded-2xl border border-names-accent/30 bg-names-accent/10 font-display text-4xl text-names-accent">@</span>
      <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">Example identity</span>
    </div>
    <h2 className="mt-8 font-heading text-5xl font-semibold tracking-tight text-foreground">@ansem</h2>
    <p className="mt-3 text-sm text-muted-foreground">Your name. Your wallet. Your identity.</p>
    <div className="mt-8 space-y-3">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-background/50 p-4"><WalletCards className="h-5 w-5 text-names-accent"/><span className="text-sm">A name for your Solana wallet</span></div>
      <div className="flex items-center gap-3 rounded-xl border border-border bg-background/50 p-4"><BadgeCheck className="h-5 w-5 text-names-secondary"/><span className="text-sm">Owned as an NFT in your wallet</span></div>
    </div>
    <div className="mt-8 rounded-xl border border-names-accent/20 bg-names-accent/5 p-4">
      <p className="text-xs text-muted-foreground">From a long address to a name</p>
      <div className="mt-3 flex items-center justify-between gap-2"><span className="font-mono text-sm text-muted-foreground">7xK…9pQ</span><ArrowRight className="h-4 w-4 text-names-accent"/><span className="font-semibold text-names-accent">@ansem</span></div>
    </div>
    <p className="mt-5 text-xs leading-5 text-muted-foreground">Illustration only. Not the actual wallet address behind @ansem.</p>
  </aside>;
}