import { useEffect, useRef } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { Image } from '@/components/ui/image';
import IntroJourney from '@/components/solhandle/intro/IntroJourney';
import IntroSteps from '@/components/solhandle/intro/IntroSteps';
import '@/components/solhandle/intro/intro.css';

export default function SolHandleIntro({ onContinue }) {
  const dialog = useRef(null);
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current.showModal();
    return () => { document.body.style.overflow = previous; };
  }, []);
  return <dialog ref={dialog} aria-labelledby="intro-title" onCancel={(event) => { event.preventDefault(); onContinue(); }} className="solhandle-intro m-0 h-dvh max-h-none w-screen max-w-none overflow-y-auto border-0 bg-background p-0 font-body text-foreground">
    <div className="intro-aura pointer-events-none fixed inset-0" aria-hidden="true"/>
    <div className="relative mx-auto flex min-h-full max-w-6xl flex-col px-5 py-5 min-[768px]:px-10 min-[768px]:py-7">
      <header className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><Image src="https://media.base44.com/images/public/6a86b7e4bcec5dfac8ee9a44/d5ca25623_solhandlelogo2.png" alt="" className="h-10 w-10" fittingType="fit"/><span className="font-heading text-lg font-semibold tracking-tight">SolHandle<span className="text-names-accent">.</span></span></div><button onClick={onContinue} type="button" className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-names-accent">Skip intro<X className="h-4 w-4"/></button></header>
      <div className="my-auto pb-4 pt-8 text-center min-[768px]:pt-6">
        <h1 id="intro-title" className="sr-only">From 44 characters to your @name. The same wallet, a recognizable identity.</h1>
        <IntroJourney/><IntroSteps/>
        <button type="button" onClick={onContinue} className="mt-8 inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-names-accent to-names-secondary px-8 py-4 font-semibold text-background transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-names-accent">Discover SolHandle<ArrowRight className="h-5 w-5"/></button>
        <p className="mt-3 text-[11px] text-muted-foreground">No account needed. You stay in control of your wallet.</p>
      </div>
    </div>
  </dialog>;
}