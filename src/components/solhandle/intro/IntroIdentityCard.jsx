import { BadgeCheck, Wallet, ArrowLeftRight } from 'lucide-react';
import { Image } from '@/components/ui/image';

export default function IntroIdentityCard() {
  return <div className="intro-identity relative rounded-3xl border border-names-secondary/40 bg-card p-6 text-left shadow-2xl min-[768px]:p-8">
    <div className="flex items-center justify-between gap-3"><Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/d5ca25623_solhandlelogo2.png" alt="SolHandle" className="h-14 w-14" fittingType="fit"/><span className="rounded-full border border-names-success/30 bg-names-success/5 px-3 py-1 text-[10px] uppercase tracking-widest text-names-success">NFT op Solana</span></div>
    <p className="mt-7 text-xs uppercase tracking-[0.22em] text-muted-foreground">Een naam die je bezit</p>
    <p className="mt-2 font-display text-5xl font-semibold tracking-tight text-foreground min-[768px]:text-6xl">@ansem<span className="text-names-accent">.</span></p>
    <div className="mt-7 flex items-center gap-3 rounded-xl border border-border bg-background/60 p-3 font-mono text-xs text-muted-foreground"><BadgeCheck className="h-5 w-5 shrink-0 text-names-accent"/><span>@ansem</span><ArrowLeftRight className="h-4 w-4 shrink-0 text-names-secondary"/><Wallet className="h-4 w-4 shrink-0"/><span className="min-w-0 truncate">7Ytt…8uNw</span></div>
    <p className="mt-4 text-xs leading-5 text-muted-foreground">Je naam verwijst naar je wallet. De NFT blijft in de wallet van de eigenaar.</p>
  </div>;
}