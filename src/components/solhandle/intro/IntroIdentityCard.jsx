import { BadgeCheck, Wallet, ArrowLeftRight } from 'lucide-react';
import { Image } from '@/components/ui/image';

export default function IntroIdentityCard() {
  return <div className="relative mx-auto w-full max-w-md text-center">
    <Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/9b757b031_generated_image.png" alt="Smartphone met @ansem en zwevende SolHandle-munten met het SolHandle-logo" className="mx-auto h-[440px] w-full mix-blend-screen min-[768px]:h-[560px]" fittingType="fit"/>
    <div className="relative mx-auto -mt-1 max-w-xs rounded-xl border border-names-secondary/30 bg-card/80 px-4 py-3">
      <p className="text-[10px] uppercase tracking-widest text-names-secondary">Jouw @naam · dezelfde wallet</p>
      <div className="mt-2 flex items-center justify-center gap-2 font-mono text-xs text-muted-foreground"><BadgeCheck className="h-4 w-4 shrink-0 text-names-accent"/><span className="font-semibold text-foreground">@ansem</span><ArrowLeftRight className="h-4 w-4 text-names-secondary"/><Wallet className="h-4 w-4"/><span>7Ytt…8uNw</span></div>
    </div>
    <p className="mx-auto mt-3 max-w-xs text-xs leading-5 text-muted-foreground">Je naam verwijst naar je wallet. De NFT blijft in de wallet van de eigenaar.</p>
  </div>;
}