import { ArrowDown, CheckCircle2, Send, Wallet } from 'lucide-react';

export default function IntroPayExample() {
  return <article aria-labelledby="intro-pay-title" className="rounded-2xl border border-names-secondary/25 bg-card/80 p-5 text-left min-[768px]:p-6">
    <div className="flex items-center justify-between gap-3"><span className="text-xs font-semibold uppercase tracking-widest text-names-secondary">SolHandle Pay</span><span className="rounded-full border border-border px-2 py-1 text-[10px] text-muted-foreground">Illustration</span></div>
    <h3 id="intro-pay-title" className="mt-4 font-heading text-xl font-semibold text-foreground">Send to a name, not a long address.</h3>
    <p className="mt-2 text-xs leading-5 text-muted-foreground">Use an @handle to find the recipient's wallet before approving your payment.</p>
    <div className="mt-5 rounded-xl border border-border bg-background/70 p-4">
      <div className="flex items-center justify-between gap-3"><div><p className="text-[10px] uppercase tracking-widest text-muted-foreground">Send to</p><p className="mt-1 font-display text-2xl font-semibold text-foreground">@ansem</p></div><Send className="h-6 w-6 shrink-0 text-names-secondary"/></div>
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><Wallet className="h-4 w-4 shrink-0"/><span>Recipient wallet</span><span className="ml-auto font-mono">7Ytt…8uNw</span></div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3"><span className="text-xs text-muted-foreground">Example amount</span><span className="font-mono text-lg font-semibold text-foreground">0.10 SOL</span></div>
      <div className="my-4 flex items-center gap-2 text-xs text-muted-foreground"><ArrowDown className="h-4 w-4 text-names-secondary"/>Review recipient and approve in your wallet</div>
      <div className="flex items-center gap-2 rounded-lg border border-names-secondary/20 bg-names-secondary/5 p-3 text-sm font-semibold text-foreground"><CheckCircle2 className="h-5 w-5 shrink-0 text-names-secondary"/>Example: payment confirmed</div>
    </div>
    <p className="mt-4 text-xs leading-5 text-muted-foreground">SOL goes directly to the recipient's wallet. Always review the destination and network fee before approving.</p>
  </article>;
}