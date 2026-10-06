import { BadgeCheck, Wallet, ArrowLeftRight } from 'lucide-react';
import IntroHandlePhone from '@/components/solhandle/intro/IntroHandlePhone';

export default function IntroIdentityCard() {
  return <div className="relative mx-auto w-full max-w-md text-center">
    <IntroHandlePhone/>
    <div className="relative mx-auto -mt-1 max-w-xs rounded-xl border border-names-secondary/30 bg-card/80 px-4 py-3">
      <p className="text-[10px] uppercase tracking-widest text-names-secondary">Jouw @naam · dezelfde wallet</p>
      <div className="mt-2 flex items-center justify-center gap-2 font-mono text-xs text-muted-foreground"><BadgeCheck className="h-4 w-4 shrink-0 text-names-accent"/><span className="font-semibold text-foreground">@ansem</span><ArrowLeftRight className="h-4 w-4 text-names-secondary"/><Wallet className="h-4 w-4"/><span>7Ytt…8uNw</span></div>
    </div>
    <p className="mx-auto mt-3 max-w-xs text-xs leading-5 text-muted-foreground">Je naam verwijst naar je wallet. De NFT blijft in de wallet van de eigenaar.</p>
  </div>;
}