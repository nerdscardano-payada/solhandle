import { ArrowDown, ArrowRight } from 'lucide-react';
import { Image } from '@/components/ui/image';
import IntroIdentityCard from '@/components/solhandle/intro/IntroIdentityCard';

const address = '7YttLkHDoNj9wyDur5QKQ8LqhxRk6RhhVxb4jWQZ8uNw';
export default function IntroJourney() {
  return <section aria-label="Van walletadres naar SolHandle" className="mx-auto mt-8 max-w-5xl min-[768px]:mt-10">
    <div className="grid items-center gap-4 min-[768px]:grid-cols-[1fr_80px_1fr] min-[768px]:gap-5">
      <div className="intro-address relative mx-auto w-full max-w-md text-center">
        <Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/47d2b5283_generated_image.png" alt="Grote smartphone met een lang walletadres en munten met het Solana-logo" className="mx-auto h-[440px] w-full mix-blend-screen min-[768px]:h-[560px]" fittingType="fit"/>
        <div className="relative mx-auto -mt-1 max-w-xs rounded-xl border border-names-accent/20 bg-card/80 px-4 py-3"><p className="text-[10px] uppercase tracking-widest text-names-accent">44 tekens · één wallet</p><p className="mt-2 break-all font-mono text-xs leading-5 text-muted-foreground">{address}</p></div>
      </div>
      <div aria-hidden="true" className="intro-connector flex flex-col items-center gap-2 text-names-accent"><span className="text-[10px] font-semibold uppercase tracking-widest">SolHandle</span><ArrowRight className="hidden h-8 w-8 min-[768px]:block"/><ArrowDown className="h-7 w-7 min-[768px]:hidden"/></div>
      <IntroIdentityCard/>
    </div>
    <p className="mt-4 text-center text-[11px] leading-5 text-muted-foreground">Illustratief voorbeeld: dit adres is niet het echte walletadres achter @ansem.</p>
  </section>;
}